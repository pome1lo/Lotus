const Router = require('koa-router');
const {NEWS} = require("../database/models/news");
const router = new Router();


async function getNews(ctx) {
    try {
        const topic_name = ctx.params.topic_name;
        const limit = parseInt(ctx.query.limit) || 24;
        const page = parseInt(ctx.query.page) || 1;
        const offset = (page - 1) * limit;

        const news = await NEWS.findAll({
            where: { TOPIC_NAME: topic_name },
            limit: limit,
            offset: offset,
            order: [['ID', 'DESC']]
        });

        const totalNewsCount = await NEWS.count({ where: { TOPIC_NAME: topic_name } });
        const maxPages = Math.ceil(totalNewsCount / limit);

        ctx.body = {
            news: news,
            maxPages: maxPages
        };
    } catch (error) {
        console.log(error.message);
        ctx.status = 500;
        ctx.body = { message: "Error when receiving news." }
    }
}


const PREFIX = "/api/news/";

router.get(PREFIX + ':topic_name', getNews);

module.exports = router;
