const Router = require('koa-router');
const { POST } = require('../database/models/post');
const { SavedPost } = require('../database/models/saved');
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


// Предполагается, что у вас уже есть настроенный Koa router и импортированная модель SavedPost

router.post('/api/posts/save', async (ctx) => {
    try {
        const { userId, postId } = ctx.request.body;

        const existingEntry = await SavedPost.findOne({ where: { USER_ID: userId, POST_ID: postId } });
        if (existingEntry) {
            ctx.status = 409;
            ctx.body = 'Post is already saved.';
            return;
        }

        // Создаём новую запись в таблице SAVED_POSTS
        const savedPost = await SavedPost.create({ USER_ID: userId, POST_ID: postId });
        ctx.status = 201;
        ctx.body = savedPost;
    } catch (error) {
        ctx.status = 500;
        console.error(error.message);
        ctx.body = 'Error saving the post.';
    }
});

router.delete('/api/posts/unsave', async (ctx) => {
    try {
        const { userId, postId } = ctx.request.body; // Получаем ID пользователя и поста из тела запроса

        // Удаляем запись из таблицы SAVED_POSTS
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
});


module.exports = router;