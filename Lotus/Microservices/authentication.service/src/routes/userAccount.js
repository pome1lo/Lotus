const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const argon2 = require('argon2');
const redis = require('redis');
const { promisify } = require('util');
const { USER: User } = require('../database/models/user');

const router = new Router();
const secretKey = 'your-secret-key'; // docker

const client = redis.createClient("redis://localhost:6379");
client.connect();

router.post('/userAccount/register', async (ctx) => {
    const { username, password } = ctx.request.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        ctx.status = 400;
        ctx.body = { message: 'Пользователь уже существует' };
        return;
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = await User.create({ username, password: hashedPassword });

    await client.set(username, JSON.stringify(newUser));

    ctx.status = 201;
    ctx.body = { message: 'Пользователь успешно зарегистрирован', user: newUser.username };
});

router.post('/userAccount/auth', async (ctx) => {
    const { username, password } = ctx.request.body;

    let user = JSON.parse(await client.get(username));

    if (!user) {
        user = await User.findOne({ where: { username } });
        if (user) {
            await client.set(username, JSON.stringify(user));
        }
    }

    if (!user || !(await argon2.verify(user.password, password))) {
        ctx.status = 401;
        ctx.body = { message: 'Неверное имя пользователя или пароль' };
        return;
    }

    const token = jwt.sign({ username }, secretKey);
    ctx.body = { token };
});
router.get('/userAccount/protected', koaJwt({ secret: secretKey }), async (ctx) => {
    ctx.body = { message: 'Вы успешно прошли аутентификацию!' };
});

module.exports = router;
