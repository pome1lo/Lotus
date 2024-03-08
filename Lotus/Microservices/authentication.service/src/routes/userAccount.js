const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const argon2 = require('argon2');
const { USER: User } = require('../database/models/user');

const router = new Router();
const secretKey = 'your-secret-key';

router.post('/register', async (ctx) => {
    const { username, password } = ctx.request.body;

    // Проверка, существует ли пользователь в базе данных
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        ctx.status = 400;
        ctx.body = { message: 'Пользователь уже существует' };
        return;
    }

    // Если пользователя нет, хешируем пароль и добавляем его в базу данных
    const hashedPassword = await argon2.hash(password);
    const newUser = await User.create({ username, password: hashedPassword });

    ctx.status = 201;
    ctx.body = { message: 'Пользователь успешно зарегистрирован', user: newUser.username };
});

router.post('/auth', async (ctx) => {
    const { username, password } = ctx.request.body;


    const user = await User.findOne({ where: { username } });
    if (!user || !(await argon2.verify(user.password, password))) {
        ctx.status = 401;
        ctx.body = { message: 'Неверное имя пользователя или пароль' };
        return;
    }


    const token = jwt.sign({ username }, secretKey);
    ctx.body = { token };
});

router.get('/protected', koaJwt({ secret: secretKey }), async (ctx) => {
    ctx.body = { message: 'Вы успешно прошли аутентификацию!' };
});

module.exports = router;
