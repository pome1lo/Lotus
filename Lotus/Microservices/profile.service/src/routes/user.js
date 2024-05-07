const Router = require('koa-router');
const { POST } = require('../database/models/post');
const { USER } = require('../database/models/user');
const { SUBSCRIPTION } = require('../database/models/subscription');
const { Op } = require('sequelize');
const koaJwt = require("koa-jwt");

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

const router = new Router();

async function protectedRoute(ctx) {
    ctx.body = { message: 'Вы успешно прошли аутентификацию!' };
}

async function getRecentPosts(ctx) {
    try {
        const postsWithImages = await POST.findAll({
            where: { IMAGE: { [Op.ne]: null } },
            order: [['PUBLISHED_AT', 'DESC']],
            limit: 3
        });

        ctx.status = 200;
        ctx.body = { posts: postsWithImages };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: error.message };
    }
}

async function subscribeUser(ctx) {
    const { user_id, to_id } = ctx.request.body;

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
    const { user_id, to_id } = ctx.request.body;

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
        const userId = parseInt(ctx.params.userId, 10);

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
    const subscriberId = parseInt(ctx.params.userId, 10);

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
    const userId = parseInt(ctx.params.userId, 10);

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
    const excludedUserId = parseInt(ctx.params.userId, 10);

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

router.get('/api/account/protected', koaJwt({ secret: SECRET_KEY }), protectedRoute);
router.get('/api/posts/recent', getRecentPosts);
router.post('/api/user/subscribe', koaJwt({ secret: SECRET_KEY }), subscribeUser);
router.post('/api/user/unsubscribe', koaJwt({ secret: SECRET_KEY }), unsubscribeUser);
router.get('/api/user/:userId/posts', getUserPosts);
router.get('/api/user/:userId/subscriptions', getUserSubscriptions);
router.get('/api/user/:userId/subscribers', getUserSubscribers);
router.get('/api/user/suggestions/:userId', koaJwt({ secret: SECRET_KEY }), getUserSuggestions);

module.exports = router;