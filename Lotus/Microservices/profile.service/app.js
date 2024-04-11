const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const ProfileRoutes = require('./src/routes/profile');
const AccountRoutes = require('./src/routes/account');
const UserRoutes = require('./src/routes/user');
const port = 31003;
const app = new Koa();
const cors = require('koa2-cors');
const amqp = require('amqplib/callback_api');
const { USER: User } = require('./src/database/models/user');
const fs = require("fs");
const https = require("https");

app.use(cors());
app.use(bodyParser());

app.use(ProfileRoutes.routes());
app.use(AccountRoutes.routes());
app.use(UserRoutes.routes());




const options = {
    key:  fs.readFileSync('D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl\\LAB.key'),
    cert: fs.readFileSync('D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl\\LAB.crt')
};

const server = https.createServer(options, app.callback());
server.listen(port, () => console.log(`Сервер запущен на порту ${port}`));


const RABBITMQ_HOST = process.env.RABBITMQ_HOST == null ? "localhost" : process.env.RABBITMQ_HOST;
const RABBITMQ_PORT = process.env.RABBITMQ_PORT == null ? 5672 : process.env.RABBITMQ_PORT;

amqp.connect(`amqp://${RABBITMQ_HOST}:${RABBITMQ_PORT}`, function(error0, connection) {
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
