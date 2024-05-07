const Router = require('koa-router');
const { USER } = require('../database/models/user');
const { POST } = require('../database/models/post');
const crypto = require('crypto');
const argon2 = require('argon2');
const koaJwt = require('koa-jwt');
const Sequelize = require('sequelize');
const { updatePassword, deleteUser } = require("../services/gRPC/AuthServer");
const Op = Sequelize.Op;

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

const router = new Router();

async function protectedRoute(ctx) {
    ctx.body = { message: 'Вы успешно прошли аутентификацию!' };
}

async function personalRoute(ctx) {
    const { id, username, firstname, lastname } = ctx.request.body;

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

async function securityRoute(ctx) {
    const { id, password } = ctx.request.body;

    try {
        const user = await USER.findByPk(id);
        if (!user) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }

        const salt = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await argon2.hash(password + salt);

        updatePassword(id, hashedPassword, salt);
        await user.save();

        ctx.status = 200;
        ctx.body = { message: 'User updated successfully' };

    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
}

async function deleteRoute(ctx) {
    const { id } = ctx.request.body;

    try {
        const user = await USER.findByPk(id);

        if (!user) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }

        deleteUser(id);

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

router.get('/api/account/protected', koaJwt({ secret: SECRET_KEY }), protectedRoute);
router.post('/api/account/personal', koaJwt({ secret: SECRET_KEY }), personalRoute);
router.post('/api/account/security', koaJwt({ secret: SECRET_KEY }), securityRoute);
router.delete('/api/account/delete', koaJwt({ secret: SECRET_KEY }), deleteRoute);

module.exports = router;
