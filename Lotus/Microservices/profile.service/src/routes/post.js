const Router = require('koa-router');
const { POST } = require('../database/models/post');
const { SavedPost } = require('../database/models/saved');
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

async function savePost(ctx) {
    try {
        const { userId, postId } = ctx.request.body;

        const existingEntry = await SavedPost.findOne({ where: { USER_ID: userId, POST_ID: postId } });
        if (existingEntry) {
            ctx.status = 409;
            ctx.body = 'Post is already saved.';
            return;
        }

        const savedPost = await SavedPost.create({ USER_ID: userId, POST_ID: postId });
        ctx.status = 201;
        ctx.body = savedPost;
    } catch (error) {
        ctx.status = 500;
        console.error(error.message);
        ctx.body = 'Error saving the post.';
    }
}

async function unsavePost(ctx) {
    try {
        const { userId, postId } = ctx.request.body;

        const deleted = await SavedPost.destroy({ where: { USER_ID: userId, POST_ID: postId } });
        if (deleted) {
            ctx.status = 200;
            ctx.body = 'Post was unsaved.';
        } else {
            ctx.status = 404;
            ctx.body = 'Post not found or was not saved.';
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = 'Error unsaving the post.';
    }
}

router.get('/api/posts/recent', getRecentPosts);
router.post('/api/posts/save', koaJwt({ secret: SECRET_KEY }), savePost);
router.delete('/api/posts/unsave', koaJwt({ secret: SECRET_KEY }), unsavePost);

module.exports = router;
