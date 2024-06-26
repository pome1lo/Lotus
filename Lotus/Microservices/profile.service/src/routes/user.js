const Router = require('koa-router');
const { POST } = require('../database/models/post');
const { USER } = require('../database/models/user');
const { SUBSCRIPTION } = require('../database/models/subscription');
const { Op } = require('sequelize');
const koaJwt = require("koa-jwt");
const sequelize = require("../database/config");
const {SUPPORT} = require("../database/models/support");
const {sendToQueue} = require("../services/RabbitMQ/sendToQueue");

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
            ctx.body = { message: 'User not found' };
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

        sendToQueue('UserNotificationQueue', {
            AUTHOR: `New subscriber!`,
            USER_ID: to_id,
            CONTENT: `You have a new subscriber! ${user.USERNAME} has subscribed to you.`,
            IMAGE: subscribeToUser.PROFILE_PICTURE
        });

        ctx.status = 200;
        ctx.body = { message: 'Subscribed successfully' };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: 'Something went wrong' };
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
            ctx.body = { message: 'User not found' };
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

        unsubscribeFromUser.SUBSCRIBERS_COUNT -= 1;  // Исправлено здесь
        await unsubscribeFromUser.save();

        ctx.status = 200;
        ctx.body = { message: 'Unsubscribed successfully' };
    } catch (error) {
        ctx.status = 500;
        console.error(error.message);
        ctx.body = { message: 'Something went wrong' };
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
            ctx.body = { message: 'Posts not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { message: 'Something went wrong' };
    }
}

async function getUserSubscriptions(ctx) {
    const subscriberId = ctx.state.user.user_id;

    try {
        const userWithSubscriptions = await USER.findByPk(subscriberId, {
            include: [{
                model: USER,
                as: 'Subscriptions',
                attributes: ['ID', 'USERNAME', 'EMAIL', 'FIRSTNAME', 'LASTNAME', 'DESCRIPTION', 'PROFILE_PICTURE'],
                through: {
                    attributes: []
                }
            }]
        });

        if (!userWithSubscriptions) {
            ctx.status = 404;
            ctx.body = { message: 'User not found' };
            return;
        }

        ctx.body = {
            subscriptions:  userWithSubscriptions.Subscriptions
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
        console.error(error.message);
    }
}

async function getUserSubscribers(ctx) {
    const userId =  ctx.state.user.user_id;

    try {
        const userWithSubscribers = await USER.findByPk(userId, {
            include: [{
                model: USER,
                as: 'Subscribers',
                attributes: ['ID', 'USERNAME', 'EMAIL', 'FIRSTNAME', 'LASTNAME', 'DESCRIPTION', 'PROFILE_PICTURE'],
                through: {
                    attributes: []
                }
            }]
        });

        if (!userWithSubscribers) {
            ctx.status = 404;
            ctx.body = { message: 'User not found' };
            return;
        }

        ctx.body = {
            subscribers: userWithSubscribers.Subscribers
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
        console.error(error.message);
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

async function support(ctx) {
    const user_id = ctx.state.user.user_id;
    const username = ctx.state.user.username;
    const email = ctx.state.user.email;
    const { problem_message } = ctx.request.body;

    try {
        const newSupportMessage = await SUPPORT.create({
            USER_ID: user_id,
            PROBLEM_MESSAGE: problem_message
        });

        const data = {
            EMAIL: email,
            USERNAME: username,
            PROBLEM_MESSAGE: problem_message
        }
        sendToQueue("SupportEmailNotificationQueue", data);

        ctx.status = 201;
        ctx.body = { message: 'Support message saved successfully', supportMessageId: newSupportMessage.ID };
    } catch (error) {
        console.error('Error saving support message:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
}


const PREFIX = "/api/profile/";

router.get(PREFIX + 'user/get/posts', koaJwt({ secret: SECRET_KEY }), getUserPosts);
router.get(PREFIX + 'user/get/subscriptions', koaJwt({ secret: SECRET_KEY }), getUserSubscriptions);
router.get(PREFIX + 'user/get/subscribers', koaJwt({ secret: SECRET_KEY }), getUserSubscribers);
router.get(PREFIX + 'user/get/suggestions', koaJwt({ secret: SECRET_KEY }), getUserSuggestions);
router.post(PREFIX + 'user/subscribe', koaJwt({ secret: SECRET_KEY }), subscribeUser);
router.post(PREFIX + 'user/unsubscribe', koaJwt({ secret: SECRET_KEY }), unsubscribeUser);
router.post(PREFIX + 'user/support', koaJwt({ secret: SECRET_KEY }), support);

module.exports = router;