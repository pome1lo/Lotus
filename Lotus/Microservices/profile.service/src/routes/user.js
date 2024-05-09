const Router = require('koa-router');
const { POST } = require('../database/models/post');
const { USER } = require('../database/models/user');
const { SUBSCRIPTION } = require('../database/models/subscription');
const { Op } = require('sequelize');
const koaJwt = require("koa-jwt");
const sequelize = require("../database/config");

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

const router = new Router();

async function subscribeUser(ctx) {
    const user_id = ctx.state.user.user_id;
    const { to_id } = ctx.request.body;

    try {
        const user = await USER.findByPk(user_id);
        const subscribeToUser = await USER.findByPk(to_id);

        if (!user || !subscribeToUser) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }

        const existingSubscription = await SUBSCRIPTION.findOne({ where: { SUBSCRIBER_ID: user_id, SUBSCRIBED_TO_ID: to_id } });
        if (existingSubscription) {
            ctx.status = 400;
            ctx.body = { message: 'You are already subscribed to this user' };
            return;
        }

        await SUBSCRIPTION.create({ SUBSCRIBER_ID: user_id, SUBSCRIBED_TO_ID: to_id });

        user.SUBSCRIPTIONS_COUNT += 1;
        await user.save();

        subscribeToUser.SUBSCRIBERS_COUNT += 1;
        await subscribeToUser.save();

        ctx.status = 200;
        ctx.body = { message: 'Subscribed successfully' };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
}

async function unsubscribeUser(ctx) {
    const user_id = ctx.state.user.user_id;
    const { to_id } = ctx.request.body;

    try {
        const user = await USER.findByPk(user_id);
        const unsubscribeFromUser = await USER.findByPk(to_id);

        if (!user || !unsubscribeFromUser) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }

        const subscription = await SUBSCRIPTION.findOne({ where: { SUBSCRIBER_ID: user_id, SUBSCRIBED_TO_ID: to_id } });
        if (!subscription) {
            ctx.status = 400;
            ctx.body = { message: 'You are not subscribed to this user' };
            return;
        }

        await subscription.destroy();

        user.SUBSCRIPTIONS_COUNT -= 1;
        await user.save();

        unsubscribeFromUser.SUBSCRIBER_COUNT -= 1;
        await unsubscribeFromUser.save();

        ctx.status = 200;
        ctx.body = { message: 'Unsubscribed successfully' };
    } catch (error) {
        ctx.status = 500;
        console.error(error.message);
        ctx.body = { error: 'Something went wrong' };
    }
}

async function getUserPosts(ctx) {
    try {
        const userId = ctx.state.user.user_id;

        const subscriptions = await SUBSCRIPTION.findAll({
            where: { SUBSCRIBER_ID: userId },
        });

        const subscribedToIds = subscriptions.map(sub => sub.SUBSCRIBED_TO_ID);

        const posts = await POST.findAll({
            where: { USER_ID: subscribedToIds },
            order: [['PUBLISHED_AT', 'DESC']],
            include: [{
                model: USER,
                attributes: ['USERNAME', 'PROFILE_PICTURE']
            }]
        });

        if (posts) {
            ctx.body = {
                posts: posts.map(post => ({
                    ...post.get({ plain: true }),
                    USERNAME: post.USER?.USERNAME,
                    PROFILE_PICTURE: post.USER?.PROFILE_PICTURE
                }))
            };
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Posts not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
}

async function getUserSubscriptions(ctx) {
    const subscriberId = ctx.state.user.user_id;

    try {
        const userWithSubscriptions = await USER.findByPk(subscriberId, {
            include: [{
                model: USER,
                as: 'Subscriptions',
                attributes: ['ID', 'USERNAME', 'EMAIL', 'FIRSTNAME', 'LASTNAME', 'PHONE_NUMBER', 'PROFILE_PICTURE'],
                through: {
                    attributes: []
                }
            }]
        });

        if (!userWithSubscriptions) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }

        ctx.body = {
            subscriptions:  userWithSubscriptions.Subscriptions
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Internal Server Error' };
        console.error(error);
    }
}

async function getUserSubscribers(ctx) {
    const userId =  ctx.state.user.user_id;

    try {
        const userWithSubscribers = await USER.findByPk(userId, {
            include: [{
                model: USER,
                as: 'Subscribers',
                attributes: ['ID', 'USERNAME', 'EMAIL', 'FIRSTNAME', 'LASTNAME', 'PHONE_NUMBER', 'PROFILE_PICTURE'],
                through: {
                    attributes: []
                }
            }]
        });

        if (!userWithSubscribers) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }

        ctx.body = {
            subscribers: userWithSubscribers.Subscribers
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Internal Server Error' };
        console.error(error);
    }
}

async function getUserSuggestions(ctx) {
    const excludedUserId= ctx.state.user.user_id;

    try {
        const subscribedIds = (await SUBSCRIPTION.findAll({
            where: {SUBSCRIBER_ID: excludedUserId},
            attributes: ['SUBSCRIBED_TO_ID']
        })).map(sub => sub.SUBSCRIBED_TO_ID);

        ctx.body = {
            suggestions:  await USER.findAll({
                where: {
                    ID: {
                        [Op.ne]: excludedUserId,
                        [Op.notIn]: subscribedIds
                    }
                },
                order: sequelize.literal('RAND()'),
                limit: 5
            })
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Internal Server Error' };
        console.error(error);
    }
}

router.get('/api/user/posts', koaJwt({ secret: SECRET_KEY }), getUserPosts);
router.get('/api/user/subscriptions', koaJwt({ secret: SECRET_KEY }), getUserSubscriptions);
router.get('/api/user/subscribers', koaJwt({ secret: SECRET_KEY }), getUserSubscribers);
router.get('/api/user/suggestions', koaJwt({ secret: SECRET_KEY }), getUserSuggestions);
router.post('/api/user/subscribe', koaJwt({ secret: SECRET_KEY }), subscribeUser);
router.post('/api/user/unsubscribe', koaJwt({ secret: SECRET_KEY }), unsubscribeUser);

module.exports = router;