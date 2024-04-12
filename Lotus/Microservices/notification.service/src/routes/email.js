const Router = require('koa-router');

const router = new Router();

router.get('/api/notify/email', async (ctx) => {
    ctx.body = "successfully";
});

module.exports = router;