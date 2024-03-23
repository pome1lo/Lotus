const NEWS = require("../database/models/news");
const Router = require('koa-router');
const router = new Router();
router.get('/api/news', async (ctx) => {
    ctx.body = await NEWS.findAll();
});

module.exports = router;