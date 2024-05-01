const Router = require('koa-router');
const {NOTIFICATION} = require("../database/Models/notification");


const router = new Router();

router.get('/api/notify/email/:user_id', async (ctx) => {
    const user_id = ctx.params.user_id;

    try {
        const notifications = await NOTIFICATION.findAll({ where: { USER_ID: user_id } });

        ctx.status = 200;
        ctx.body = notifications;
    } catch (error) {
        console.log(error.message);
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
});


module.exports = router;