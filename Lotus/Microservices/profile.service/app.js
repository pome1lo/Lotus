const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const fs = require("fs");
const https = require("https");

const path = require("path");
const serve = require("koa-static");
const Router = require('koa-router');

const ProfileRoutes = require('./src/routes/profile');
const AccountRoutes = require('./src/routes/account');
const UserRoutes = require('./src/routes/user');
const PostRoutes = require('./src/routes/post');

const connectRabbitMQ = require('./src/services/RabbitMQ/connectRabbitMQ');

const {initializeSocketIo} = require('./src/services/Socket/socket');

const port = process.env.APP_PORT || 31903;
const isDocker = process.env.APP_PORT == null;
const PathToLAB = isDocker ? 'D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl' : '/app';

const app = new Koa();
app.keys = [ process.env.SECRET_KEY || 'secret_key' ];

const imagesPath = path.join(__dirname, './src/data/users/posts/images');
app.use(serve(imagesPath));
app.use(cors({
    origin: 'https://localhost:3000',
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}));

app.use(bodyParser());

app.use(ProfileRoutes.routes());
app.use(AccountRoutes.routes());
app.use(UserRoutes.routes());
app.use(PostRoutes.routes());
app.use(new Router().routes());

const options = {
    key:  fs.readFileSync(path.join(PathToLAB, 'LAB.key')),
    cert: fs.readFileSync(path.join(PathToLAB, 'LAB.crt'))
};

const server = https.createServer(options, app.callback());
initializeSocketIo(server);

server.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

connectRabbitMQ();


