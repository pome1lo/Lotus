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


router.get('/api/user/:userId/posts', async (ctx) => {
    try {
        USER.hasMany(POST, { foreignKey: 'USER_ID' });
        POST.belongsTo(USER, { foreignKey: 'USER_ID' });

        const userId = ctx.params.userId;

        // Получаем список подписок пользователя
        const subscriptions = await SUBSCRIPTION.findAll({
            where: { SUBSCRIBER_ID: userId },
        });

        // Получаем ID пользователей, на которых подписан пользователь
        const subscribedToIds = subscriptions.map(sub => sub.SUBSCRIBED_TO_ID);

        // Получаем посты от пользователей, на которых подписан пользователь
        const posts = await POST.findAll({
            where: { USER_ID: subscribedToIds },
            order: [['PUBLISHED_AT', 'DESC']],
            include: [{
                model: USER,
                attributes: ['USERNAME', 'PROFILE_PICTURE']
            }]
        });


        ctx.body = {
            posts:posts.map(post => ({
                ...post.get(),
                USERNAME: post.USER.USERNAME,
                PROFILE_PICTURE: post.USER.PROFILE_PICTURE
            }))
        };
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = 'Произошла ошибка при обработке вашего запроса';
    }
});



module.exports = router;
