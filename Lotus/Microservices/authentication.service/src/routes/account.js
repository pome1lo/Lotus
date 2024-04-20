const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const argon2 = require('argon2');
const redis = require('redis');
const crypto = require('crypto');
const { USER } = require('../database/models/user');
const { send } = require('../services/mailer/config');
const { sendToQueue} = require("../services/RabbitMQ/sendToQueue");

const REDIS_HOST = process.env.REDIS_HOST == null ? "localhost" : process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT == null ? 6379 : process.env.REDIS_PORT;
const client = redis.createClient(`redis://${REDIS_HOST}:${REDIS_PORT}`);

const router = new Router();
const secretKey =  process.env.SECRET_KEY == null ? 'secret_key' : process.env.SECRET_KEY;

client.connect();
client.on('error', function(error) { console.error(`🟥 REDIS: ${REDIS_HOST} Error: `, error); });
client.on('connect', async function() { console.log(`🟩 REDIS: ${REDIS_HOST} Successful`); });


router.post('/api/auth/account/register', async (ctx) => {
    const { username, email, password } = ctx.request.body;
    const existingUser = await USER.findOne({ where: { EMAIL: email } });

    if (existingUser) {
        ctx.status = 400;
        ctx.body = { message: 'The user already exists' };
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
        message: 'The user has been successfully registered',
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
        ctx.body = { message: 'Invalid username or password' };
        return;
    }

    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    ctx.body = { token, username: user.USERNAME };
});

router.post('/api/auth/account/verifyEmail', async (ctx) => {
    const { username, email } = ctx.request.body;

    try {
        const token = crypto.randomBytes(20).toString('hex');
        const verificationLink = `https://localhost:31002/api/auth/account/verify-email?token=${token}`;

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
        user.PASSWORD = await argon2.hash(password + salt);
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