const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const argon2 = require('argon2');
const redis = require('redis');
const { promisify } = require('util');
const crypto = require('crypto');
const { USER: User } = require('../database/models/user');
const amqp = require('amqplib/callback_api');

const router = new Router();
const secretKey = 'your-secret-key'; // docker

const client = redis.createClient("redis://localhost:6379");
client.connect();


router.post('/api/auth/userAccount/register', async (ctx) => {
    const { username, email, password } = ctx.request.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        ctx.status = 400;
        ctx.body = { message: 'Пользователь уже существует' };
        return;
    }

    const salt = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await argon2.hash(password + salt);

    const newUser = await User.create({ username, email, password: hashedPassword, salt });

    amqp.connect('amqp://localhost:5672', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            const queue = 'userRegistered';
            const msg = JSON.stringify(newUser);

            channel.assertQueue(queue, {
                durable: false
            });

            channel.sendToQueue(queue, Buffer.from(msg));
        });
    });

    ctx.status = 201;
    ctx.body = { message: 'Пользователь успешно зарегистрирован', user: newUser.username };
});

router.post('/api/auth/userAccount/auth', async (ctx) => {
    const { username, password } = ctx.request.body;

    ctx.body = { message: "error" };

    let user = JSON.parse(await client.get(username));
    if (!user) {
        user = await User.findOne({ where: { username } });
        if (user) {
            await client.set(username, JSON.stringify(user));
        }
    }

    if (!user || !(await argon2.verify(user.password, password + user.salt))) {
        ctx.status = 401;
        ctx.body = { message: 'Неверное имя пользователя или пароль' };
        return;
    }

    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    ctx.body = { token };
});
router.get('/api/auth/userAccount/protected', koaJwt({ secret: secretKey }), async (ctx) => {
    ctx.body = { message: 'Вы успешно прошли аутентификацию!' };
});

module.exports = router;
