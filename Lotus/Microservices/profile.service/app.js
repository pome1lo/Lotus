const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const ProfileRoutes = require('./src/routes/profile');
const AccountRoutes = require('./src/routes/account');
const UserRoutes = require('./src/routes/user');
const port = 31003;
const app = new Koa();
const cors = require('koa2-cors');
const fs = require("fs");
const https = require("https");
const connectRabbitMQ = require('./src/services/RabbitMQ/rabbitmq');

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

connectRabbitMQ();
