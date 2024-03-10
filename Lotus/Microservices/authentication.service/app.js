const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const userAccountRoutes = require('./src/routes/userAccount');
const port = 31002;
const app = new Koa();
const cors = require('koa2-cors');

app.use(cors());
app.use(bodyParser());

app.use(userAccountRoutes.routes());
app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));