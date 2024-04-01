const NEWS = require("../database/models/news");
const Router = require('koa-router');
const router = new Router();
router.get('/api/news', async (ctx) => {
    const news = await NEWS.findAll();

    if (news) {
        ctx.body = news;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'News not found' };
    }
});

router.get('/api/news/:id', async (ctx) => {
    const id = ctx.params.id;
    console.log(id);
    const news = await NEWS.findOne({ where: { id } });

    if (news) {
        ctx.body = news;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'News not found :(' };
    }
});


module.exports = router;