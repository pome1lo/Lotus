const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const ProfileRoutes = require('./src/routes/profile');
const AccountRoutes = require('./src/routes/account');
const UserRoutes = require('./src/routes/user');
const port = process.env.APP_PORT == null ? 31903 : process.env.APP_PORT;
const app = new Koa();
const cors = require('koa2-cors');
const fs = require("fs");
const https = require("https");
const connectRabbitMQ = require('./src/services/RabbitMQ/rabbitmq');
const path = require("path");
const serve = require("koa-static");
const Router = require('koa-router');
const router = new Router();

const imagesPath = path.join(__dirname, './src/data/users/posts/images');
app.use(serve(imagesPath));
app.use(cors({ origin: '*' }));
app.use(bodyParser());

app.use(ProfileRoutes.routes());
app.use(AccountRoutes.routes());
app.use(UserRoutes.routes());
app.use(router.routes());

const isDocker = process.env.APP_PORT == null;
const PathToLAB = isDocker ? 'D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl' : '/app';

const options = {
    key:  fs.readFileSync(path.join(PathToLAB, 'LAB.key')),
    cert: fs.readFileSync(path.join(PathToLAB, 'LAB.crt'))
};


const server = https.createServer(options, app.callback());
server.listen(port, () => console.log(`Сервер запущен на порту ${port}`));

connectRabbitMQ();
