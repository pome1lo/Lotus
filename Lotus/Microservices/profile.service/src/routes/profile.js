const Router = require('koa-router');
const { USER: User } = require('../database/models/user');
const { POST: Post } = require('../database/models/post');
const router = new Router();


router.get('/api/profile/:userName', async (ctx) => {
    const userName =  ctx.params.userName;
    console.log(userName);
    const user = await User.findOne({ where: { userName } });

    if (user) {
        ctx.body = user;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'User not found' };
    }
});

router.get('/api/profiles', async (ctx) => {
    const users = await User.findAll();

    if (users) {
        ctx.body = users;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'Users not found' };
    }
});

router.post('/api/profile/posts/create', async (ctx) => {
    const { UserId, Title, Content, Image } = ctx.request.body;

    try {
        const post = await Post.create({
            UserId,
            Title,
            Content,
            Image
        });

        ctx.status = 201;
        ctx.body = { message: 'Post created successfully', post };
    } catch (error) {
        ctx.status = 500;
        console.log(error.message);
        ctx.body = { error: 'Something went wrong' };
    }
});


module.exports = router;
