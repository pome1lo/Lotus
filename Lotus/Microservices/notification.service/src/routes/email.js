const Router = require('koa-router');
const { NOTIFICATION } = require("../database/Models/notification");
const koaJwt = require('koa-jwt');

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';
const router = new Router();

async function notifyUserEmail(ctx) {
    const user_id = ctx.state.user.user_id;

    try {
        ctx.status = 200;
        ctx.body = {
            notifications: await NOTIFICATION.findAll({ where: { USER_ID: user_id } })
        } ;
    } catch (error) {
        console.error(error.message);
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
}

router.get ('/api/notify/email', koaJwt({ secret: SECRET_KEY }), notifyUserEmail);

module.exports = router;
