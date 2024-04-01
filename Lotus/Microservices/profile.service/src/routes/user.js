const Router = require('koa-router');
const { USER: User } = require('../database/models/user');
const { POST: Post } = require('../database/models/post');
const { SUBSCRIPTION: Subscription } = require('../database/models/subscription');
const router = new Router();

router.post('/api/user/subscribe', async (ctx) => {
    const { UserId, SubscribeToId } = ctx.request.body;

    try {
        const user = await User.findByPk(UserId);
        const subscribeToUser = await User.findByPk(SubscribeToId);

        if (!user || !subscribeToUser) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }


        const existingSubscription = await Subscription.findOne({ where: { subscriberId: UserId, subscribedToId: SubscribeToId } });
        if (existingSubscription) {
            ctx.status = 400;
            ctx.body = { message: 'You are already subscribed to this user' };
            return;
        }


        await Subscription.create({ subscriberId: UserId, subscribedToId: SubscribeToId });

        user.SubscriptionsCount += 1;
        await user.save();

        subscribeToUser.SubscribersCount += 1;
        await subscribeToUser.save();

        ctx.status = 200;
        ctx.body = { message: 'Subscribed successfully' };
    } catch (error) {
        ctx.status = 500;
        console.log(error.message);
        ctx.body = { error: 'Something went wrong' };
    }
});

router.post('/api/user/unsubscribe', async (ctx) => {
    const { UserId, UnsubscribeFromId } = ctx.request.body;

    try {
        const user = await User.findByPk(UserId);
        const unsubscribeFromUser = await User.findByPk(UnsubscribeFromId);

        if (!user || !unsubscribeFromUser) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }

        const subscription = await Subscription.findOne({ where: { subscriberId: UserId, subscribedToId: UnsubscribeFromId } });
        if (!subscription) {
            ctx.status = 400;
            ctx.body = { message: 'You are not subscribed to this user' };
            return;
        }

        await subscription.destroy();

        user.SubscriptionsCount -= 1;
        await user.save();

        unsubscribeFromUser.SubscribersCount -= 1;
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
