const Router = require('koa-router');
const { USER} = require('../database/models/user');
const { POST } = require('../database/models/post');
const router = new Router();


router.get('/api/profile/:username', async (ctx) => {
    const username =  ctx.params.username;
    console.log(username);
    const user = await USER.findOne({ where: { USERNAME: username } });

    if (user) {
        ctx.body = user;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'User not found' };
    }
});

router.get('/api/profiles', async (ctx) => {
    const users = await USER.findAll();

    if (users) {
        ctx.body = users;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'Users not found' };
    }
});

router.post('/api/profile/posts/create', async (ctx) => {
    const { user_id, title, content, image } = ctx.request.body;

    try {
        const post = await POST.create({
            USER_ID: user_id,
            TITLE: title,
            CONTENT: content,
            IMAGE: image
        });

        ctx.status = 201;
        ctx.body = { message: 'Post created successfully', post };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
});


module.exports = router;
