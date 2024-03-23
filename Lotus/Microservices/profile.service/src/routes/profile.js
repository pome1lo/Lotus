const Router = require('koa-router');
const { USER: User } = require('../database/models/user');

const router = new Router();


router.get('/api/getProfile', async (ctx) => {
    const userName = ctx.query.userName;
    console.log(userName);
    const user = await User.findOne({ where: { userName } });

    if (user) {
        ctx.body = user;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'Пользователь не найден' };
    }
});

router.get('/api/getAllProfiles', async (ctx) => {
    const users = await User.findAll();

    if (users) {
        ctx.body = users;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'Пользователи не найдены' };
    }
});

router.post('/api/profile/customize', async (ctx) => {  });
router.post('/api/profile/customize', async (ctx) => {  });

module.exports = router;
