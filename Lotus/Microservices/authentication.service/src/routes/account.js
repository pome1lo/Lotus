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

    const token = jwt.sign({
        user_id: newUser.ID,
        username,
        email
    }, secretKey, { expiresIn: '1h' });

    ctx.status = 201;
    ctx.body = {
        message: 'The user has been successfully registered',
        username: newUser.USERNAME,
        token: token,
    };
}

async function identifyUser(ctx) {
    const { username, email, password } = ctx.request.body;
    const existingUser = await USER.findOne({ where: { EMAIL: email } });

    if (existingUser) {
        ctx.status = 400;
        ctx.body = { message: 'The user already exists' };
        return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verifyEmail(username, email, `please confirm your email address using the entered code: ${code}`);

    ctx.body = {
        code: code
    };
}

async function loginUser(ctx) {
    const { username, password } = ctx.request.body;

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

    const token = jwt.sign({
        user_id: user.ID,
        username: user.USERNAME,
        email: user.EMAIL
    }, secretKey, { expiresIn: '1h' });

    ctx.body = {
        token,
        username: user.USERNAME
    };
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
        ctx.body = { message: 'Something went wrong' };
    }
}

const PREFIX = "/api/auth/";

router.post(PREFIX + 'account/identify', identifyUser);
router.post(PREFIX + 'account/login', loginUser);
router.post(PREFIX + 'account/create', createUser);
router.post(PREFIX + 'account/reset-password', resetUserPassword);

module.exports = router;