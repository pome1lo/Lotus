const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const ProfileRoutes = require('./src/routes/profile');
const AccountRoutes = require('./src/routes/account');
const UserRoutes = require('./src/routes/user');
const port = 31003;
const profileApp = new Koa();
const cors = require('koa2-cors');
const amqp = require('amqplib/callback_api');
const { USER: User } = require('./src/database/models/user');

profileApp.use(cors());
profileApp.use(bodyParser());

profileApp.use(ProfileRoutes.routes());
profileApp.use(AccountRoutes.routes());
profileApp.use(UserRoutes.routes());

profileApp.listen(port, () => console.log(`Сервер запущен на порту ${port}`));


amqp.connect('amqp://localhost:5672', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        const queue = 'userRegistered';

        channel.assertQueue(queue, {
            durable: false
        });

        channel.consume(queue, async function (msg) {
            const user = JSON.parse(msg.content.toString());
            await User.create({USERNAME: user.USERNAME, EMAIL: user.EMAIL});
        }, {
            noAck: true
        });
    });
});
