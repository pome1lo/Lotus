const Router = require('koa-router');
const { USER } = require('../database/models/user');
const { POST } = require('../database/models/post');
const crypto = require('crypto');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const Sequelize = require('sequelize');
const { updatePassword: grpcUpdatePassword, deleteUser: grpcDeleteUser, updateAccount: grpcUpdateAccount } = require("../services/gRPC/AuthServer");
const {COMMENT} = require("../database/models/comment");
const {SUBSCRIPTION} = require("../database/models/subscription");
const {SUPPORT} = require("../database/models/support");
const Op = Sequelize.Op;

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

const router = new Router();


async function updateAccount(ctx) {
    const { id, username, firstname, lastname, description } = ctx.request.body;

    if (ctx.state.user.user_id !== id) {
        ctx.status = 401;
        ctx.body = { message: 'Unauthorized: You can only update your own information' };
        return;
    }

    try {
        const user = await USER.findByPk(id);

        if (!user) {
            ctx.status = 404;
            ctx.body = { message: 'User not found' };
            return;
        }

        user.USERNAME = username || user.USERNAME;
        user.FIRSTNAME = firstname || user.FIRSTNAME;
        user.LASTNAME = lastname || user.LASTNAME;
        user.DESCRIPTION = description || user.DESCRIPTION;

        grpcUpdateAccount(id, user.USERNAME);

        await user.save();

        const token = jwt.sign({
            user_id: user.ID,
            username,
            email: user.email
        }, SECRET_KEY, { expiresIn: '1h' });

        ctx.status = 200;
        ctx.body = {
            message: 'User updated successfully',
            username: user.USERNAME,
            token: token,
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: 'Something went wrong' };
    }
}

async function updatePassword(ctx) {
    const { new_password } = ctx.request.body;
    const id = ctx.state.user.user_id;

    try {
        const user = await USER.findByPk(id);
        if (!user) {
            ctx.status = 404;
            ctx.body = { message: 'User not found' };
            return;
        }

        const salt = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await argon2.hash(new_password + salt);

        grpcUpdatePassword(id, hashedPassword, salt);
        await user.save();

        const token = jwt.sign({
            user_id: user.ID,
            username: user.USERNAME,
            email: user.EMAIL
        }, SECRET_KEY, { expiresIn: '1h' });

        ctx.status = 200;
        ctx.body = {
            token,
            message: 'User updated successfully',
            username: user.USERNAME
        };
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { message: 'Something went wrong' };
    }
}


async function deleteAccount(ctx) {
    const id = ctx.state.user.user_id;

    try {
        const user = await USER.findByPk(id);

        if (!user) {
            ctx.status = 404;
            ctx.body = { message: 'User not found' };
            return;
        }

        await COMMENT.destroy({ where: { USER_ID: id } });

        const subscribers = await SUBSCRIPTION.findAll({ where: { SUBSCRIBED_TO_ID: id } });
        for (let sub of subscribers) {
            const subscriber = await USER.findByPk(sub.SUBSCRIBER_ID);
            subscriber.SUBSCRIPTIONS_COUNT--;
            await subscriber.save();
        }

        const subscriptions = await SUBSCRIPTION.findAll({ where: { SUBSCRIBER_ID: id } });
        for (let sub of subscriptions) {
            const subscribedTo = await USER.findByPk(sub.SUBSCRIBED_TO_ID);
            subscribedTo.SUBSCRIBERS_COUNT--;
            await subscribedTo.save();
        }

        await SUBSCRIPTION.destroy({ where: { SUBSCRIBER_ID: id } });
        await SUBSCRIPTION.destroy({ where: { SUBSCRIBED_TO_ID: id } });

        await SUPPORT.destroy({ where: { USER_ID: id } });

        const posts = await POST.findAll({ where: { USER_ID: id } });
        for (let post of posts) {
            await post.destroy();
        }
        grpcDeleteUser(id);
        await user.destroy();

        ctx.status = 200;
        ctx.body = { message: 'User and all related records deleted successfully' };
    } catch (error) {
        console.error(error.message);
        ctx.status = 500;
        ctx.body = { message: 'Something went wrong' };
    }
}



const PREFIX = "/api/profile/";

router.put(PREFIX + 'account', koaJwt({ secret: SECRET_KEY }), updateAccount);
router.put(PREFIX + 'account/password', koaJwt({ secret: SECRET_KEY }), updatePassword);
router.delete(PREFIX + 'account', koaJwt({ secret: SECRET_KEY }), deleteAccount);


module.exports = router;
