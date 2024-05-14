const Router = require('koa-router');
const { POST } = require('../database/models/post');
const { Op } = require('sequelize');
const koaJwt = require("koa-jwt");

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

const router = new Router();

async function getRecentPosts(ctx) {
    try {
        const postsWithImages = await POST.findAll({
            where: { IMAGE: { [Op.ne]: null } },
            order: [['PUBLISHED_AT', 'DESC']],
            limit: 3
        });

        ctx.status = 200;
        ctx.body = { posts: postsWithImages };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: error.message };
    }
}

const PREFIX = "/api/profile/";

router.get(PREFIX + 'posts/get/recent-posts', getRecentPosts);

module.exports = router;
