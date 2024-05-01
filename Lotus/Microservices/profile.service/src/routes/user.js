const Router = require('koa-router');
const { USER } = require('../database/models/user');
const { POST } = require('../database/models/post');
const { SUBSCRIPTION } = require('../database/models/subscription');
const router = new Router();

router.post('/api/user/subscribe', async (ctx) => {
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
});

router.post('/api/user/unsubscribe', async (ctx) => {
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
        console.log(error.message);
        ctx.body = { error: 'Something went wrong' };
    }
});


module.exports = router;
