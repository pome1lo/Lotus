const Router = require('koa-router');
const { POST } = require('../database/models/post');
const { Op } = require('sequelize');
const sequelize = require("../database/config");
const router = new Router();

router.get('/api/posts/recent', async (ctx) => {
    try {
        const postsWithImages = await POST.findAll({
            where: { IMAGE: { [Op.ne]: null } },
            order: [['PUBLISHED_AT', 'DESC']],
            limit: 3
        });

        ctx.status = 200;
        ctx.body = {
            posts: postsWithImages
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: error.message };
    }
});


module.exports = router;