'use strict';

const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('koa2-cors');
const fs = require("fs");
const https = require("https");
const path = require('path');

const newsRoutes = require('./src/routes/news');
const scheduleJob = require('./src/services/schedule/news');

const app = new Koa();
const router = new Router();

const port = process.env.APP_PORT || 31904;
const isDocker = process.env.APP_PORT == null;
const PathToLAB = isDocker ? 'D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl' : '/app';

const options = {
    key:  fs.readFileSync(path.join(PathToLAB, 'LAB.key')),
    cert: fs.readFileSync(path.join(PathToLAB, 'LAB.crt'))
};

app.use(cors());
app.use(router.routes());
app.use(newsRoutes.routes());

const server = https.createServer(options, app.callback());
server.listen(port, () => console.log(`Сервер запущен на порту ${port}`));

// scheduleJob();
