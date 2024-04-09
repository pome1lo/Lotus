const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const argon2 = require('argon2');
const redis = require('redis');
const { promisify } = require('util');
const crypto = require('crypto');
const { USER } = require('../database/models/user');
const amqp = require('amqplib/callback_api');
const { send } = require('../services/mailer/config');
const {sendToQueue} = require("../services/RabbitMQ/sendToQueue");
const client = redis.createClient("redis://localhost:6379");

const router = new Router();
const secretKey = 'your-secret-key'; //todo add data in config | docker

client.connect();



router.post('/api/auth/account/register', async (ctx) => {
    const { username, email, password } = ctx.request.body;
    const existingUser = await USER.findOne({ where: { EMAIL: email } });
    if (existingUser) {
        ctx.status = 400;
        ctx.body = { message: 'Пользователь уже существует' };
        return;
    }

    const salt = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await argon2.hash(password + salt);

    const newUser = await USER.create({
        USERNAME: username,
        EMAIL: email,
        PASSWORD: hashedPassword,
        SALT: salt
    });

    let userData = {
        USERNAME: newUser.USERNAME,
        EMAIL: newUser.EMAIL
    }

    sendToQueue('userRegistered', userData);

    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    ctx.status = 201;
    ctx.body = {
        message: 'Пользователь успешно зарегистрирован',
        username: newUser.USERNAME,
        token: token
    };
});

router.post('/api/auth/account/auth', async (ctx) => {
    const { username, password } = ctx.request.body;

    ctx.body = { message: "error" };

    let user = JSON.parse(await client.get(username));
    if (!user) {
        user = await USER.findOne({ where: { USERNAME: username } });
        if (user) {
            await client.set(username, JSON.stringify(user));
        }
    }

    if (!user || !(await argon2.verify(user.PASSWORD, password + user.SALT))) {
        ctx.status = 401;
        ctx.body = { message: 'Неверное имя пользователя или пароль' };
        return;
    }

    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    ctx.body = { token, username: user.USERNAME };
});

router.post('/api/auth/account/verifyEmail', async (ctx) => {
    const { username, email } = ctx.request.body;

    try {
        const token = crypto.randomBytes(20).toString('hex');
        const verificationLink = `http://localhost:31002/api/auth/userAccount/verify-email?token=${token}`;

        await send(email, `Hello ${username}, please verify your email by clicking on the following link: ${verificationLink}`);

        const user = await USER.findOne({ where: { USERNAME: username } });
        user.VERIFICATION_TOKEN = token;
        await user.save();

        ctx.status = 200;
        ctx.body = { message: 'Mail send!' };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
});

router.get('/api/auth/account/verify-email', async (ctx) => {
    const token = ctx.query.token;

    try {
        console.log("token " + token);

        const user = await USER.findOne({ where: { VERIFICATION_TOKEN: token } });

        if (!user) {
            ctx.status = 400;
            ctx.body = { error: 'Invalid or expired token' };
            return;
        }

        user.IS_EMAIL_VERIFIED = true;
        user.VERIFICATION_TOKEN = null;
        await user.save();

        ctx.status = 200;
        ctx.body = { message: 'Email verified successfully' };
    } catch (error) {
        console.log(error.message);
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
});

router.post('/api/auth/account/reset-password', async (ctx) => {
    const { username, password } = ctx.request.body;

    try {
        const user = await USER.findOne({ where: { USERNAME: username } });

        if (!user) {
            ctx.status = 400;
            ctx.body = { error: 'User not found' };
            return;
        }

        const salt = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await argon2.hash(password + salt);

        user.PASSWORD = hashedPassword;
        user.SALT = salt;
        await user.save();
        await client.del(username);

        ctx.status = 200;
        ctx.body = { message: 'Password reset successfully' };
    } catch (error) {
        console.log(error.message);
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
});

router.get('/api/auth/account/protected', koaJwt({ secret: secretKey }), async (ctx) => {
    ctx.body = { message: 'Вы успешно прошли аутентификацию!' };
});



module.exports = router;
