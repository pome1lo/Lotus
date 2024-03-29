const Router = require('koa-router');
const { USER: User } = require('../database/models/user');

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

module.exports = router;
