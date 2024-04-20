'use strict';
const Koa = require('koa');
const app = new Koa();
const Router = require('@koa/router');
const router = new Router();
const newsRoutes = require('./src/routes/news');
const port = process.env.APP_PORT == null ? 31904 : process.env.APP_PORT;
const cors = require('koa2-cors');
const fs = require("fs");
const https = require("https");
const path = require('path');
const scheduleJob = require('./src/services/schedule/news');

app.use(cors());

app.use(router.routes());
app.use(newsRoutes.routes());

const isDocker = process.env.APP_PORT == null;
const PathToLAB = isDocker ? '/app' : 'D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl';

const options = {
    key:  fs.readFileSync(path.join(PathToLAB, 'LAB.key')),
    cert: fs.readFileSync(path.join(PathToLAB, 'LAB.crt'))
};

const server = https.createServer(options, app.callback());
server.listen(port, () => console.log(`Сервер запущен на порту ${port}`));

scheduleJob();
