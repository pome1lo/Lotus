const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const userProfileRoutes = require('./src/routes/profile');
const userAccountRoutes = require('./src/routes/account');
const port = 31003;
const app = new Koa();
const cors = require('koa2-cors');
const amqp = require('amqplib/callback_api');
const { USER: User } = require('./src/database/models/user');

app.use(cors());
app.use(bodyParser());

app.use(userProfileRoutes.routes());
app.use(userAccountRoutes.routes());
app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));


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
            await User.create({UserName: user.username, Email: user.email});
        }, {
            noAck: true
        });
    });
});
