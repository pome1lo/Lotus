const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const argon2 = require('argon2');
const crypto = require('crypto');
const { USER } = require('../database/models/user');
const { sendToQueue } = require("../services/RabbitMQ/sendToQueue");
const { redisClient } = require('./../services/Redis/redisClient');
const { verifyEmail } = require("../services/gRPC/NotifyServer");

const router = new Router();
const secretKey = process.env.SECRET_KEY || 'secret_key';


async function createUser(ctx) {
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

    let userRegistered = {
        USERNAME: newUser.USERNAME,
        EMAIL: newUser.EMAIL,
        USER_ID: newUser.ID
    }

    sendToQueue('UserRegisteredQueue', userRegistered);
    sendToQueue('NotifyUserRegisteredQueue', userRegistered);

    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    ctx.status = 201;
    ctx.body = {
        message: 'The user has been successfully registered',
        username: newUser.USERNAME,
        token: token,
        user_id: newUser.ID
    };
}

async function loginUser(ctx) {
    const { username, password } = ctx.request.body;

    ctx.body = { message: "error" };

    let user = JSON.parse(await redisClient.get(username));
    if (!user) {
        user = await USER.findOne({ where: { USERNAME: username } });
        if (user) {
            await redisClient.set(username, JSON.stringify(user));
        }
    }

    if (!user || !(await argon2.verify(user.PASSWORD, password + user.SALT))) {
        ctx.status = 401;
        ctx.body = { message: 'Invalid username or password' };
        return;
    }

    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    ctx.body = { token, username: user.USERNAME, user_id: user.ID };
}

async function verifyUserEmail(ctx) {
    const { username, email } = ctx.request.body;

    try {
        const token = crypto.randomBytes(20).toString('hex');
        const verificationLink = `https://localhost:31901/api/auth/account/verify-email?token=${token}`;

        verifyEmail(username, email,`please verify your email by clicking on the following link: ${verificationLink}`);

        const user = await USER.findOne({ where: { USERNAME: username } });
        user.VERIFICATION_TOKEN = token;
        await user.save();

        ctx.status = 200;
        ctx.body = { message: 'Mail send!' };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
}

async function confirmUserEmail(ctx) {
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
        ctx.redirect('https://localhost:3000');
    } catch (error) {
        console.log(error.message);
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
}

async function resetUserPassword(ctx) {
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
        await redisClient.del(username);

        ctx.status = 200;
        ctx.body = { message: 'Password reset successfully' };
    } catch (error) {
        console.log(error.message);
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
}

async function protectedRoute(ctx) {
    ctx.body = { message: 'Вы успешно прошли аутентификацию!' };
}

router.post('/api/auth/account/register', createUser);
router.post('/api/auth/account/login', loginUser);
router.post('/api/auth/account/verify-email', verifyUserEmail);
router.get ('/api/auth/account/verify-email', confirmUserEmail);
router.post('/api/auth/account/reset-password', resetUserPassword);
router.get ('/api/auth/account/protected', koaJwt({ secret: secretKey }), protectedRoute);

module.exports = router;