'use strict';
const Koa = require('koa');
const app = new Koa();
const Router = require('@koa/router');
const router = new Router();
const newsRoutes = require('./src/routes/news');
const port = 31001;
const cors = require('koa2-cors');
const fs = require("fs");
const https = require("https");
const scheduleJob = require('./src/services/schedule/news');

app.use(cors());

app.use(router.routes());
app.use(newsRoutes.routes());

const options = {
    key:  fs.readFileSync('D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl\\LAB.key'),
    cert: fs.readFileSync('D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl\\LAB.crt')
};

const server = https.createServer(options, app.callback());
server.listen(port, () => console.log(`Сервер запущен на порту ${port}`));

scheduleJob();
