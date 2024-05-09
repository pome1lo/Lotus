const Router = require('koa-router');
const { USER } = require('../database/models/user');
const { POST } = require('../database/models/post');
const crypto = require('crypto');
const argon2 = require('argon2');
const koaJwt = require('koa-jwt');
const Sequelize = require('sequelize');
const { updatePassword: grpcUpdatePassword, deleteUser: grpcDeleteUser } = require("../services/gRPC/AuthServer");
const Op = Sequelize.Op;

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

const router = new Router();


async function updateAccount(ctx) {
    const { id, username, firstname, lastname } = ctx.request.body;

    if (ctx.state.user.user_id !== id) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized: You can only update your own information' };
        return;
    }

    try {
        const user = await USER.findByPk(id);

        if (!user) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }

        user.USERNAME = username || user.USERNAME;
        user.FIRSTNAME = firstname || user.FIRSTNAME;
        user.LASTNAME = lastname || user.LASTNAME;

        await user.save();

        ctx.status = 200;
        ctx.body = { message: 'User updated successfully' };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
}

async function updatePassword(ctx) {
    const { id, password } = ctx.request.body;

    if (ctx.state.user.user_id !== id) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized: You can only update your own information' };
        return;
    }

    try {
        const user = await USER.findByPk(id);
        if (!user) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }

        const salt = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await argon2.hash(password + salt);

        grpcUpdatePassword(id, hashedPassword, salt);
        await user.save();

        ctx.status = 200;
        ctx.body = { message: 'User updated successfully' };

    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
}

async function deleteAccount(ctx) {
    const { id } = ctx.request.body;

    if (ctx.state.user.user_id !== id) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized: You can only update your own information' };
        return;
    }

    try {
        const user = await USER.findByPk(id);

        if (!user) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }

        grpcDeleteUser(id);

        const posts = await POST.findAll({ where: { USER_ID: { [Op.eq]: id } } });
        for (let post of posts) {
            await post.destroy();
        }

        await user.destroy();

        ctx.status = 200;
        ctx.body = { message: 'User deleted successfully' };
    } catch (error) {
        console.error(error.message);
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
}

router.put('/api/account', koaJwt({ secret: SECRET_KEY }), updateAccount);
router.put('/api/account/password', koaJwt({ secret: SECRET_KEY }), updatePassword);
router.delete('/api/account', koaJwt({ secret: SECRET_KEY }), deleteAccount);

module.exports = router;
