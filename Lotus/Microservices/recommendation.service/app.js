'use strict';
const Koa = require('koa');
const app = new Koa();
const Router = require('@koa/router');
const router = new Router();
const axios = require('axios');
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const newsRoutes = require('./src/routes/news');
const port = 31001;
const NEWS = require('./src/database/models/news');
const cors = require('koa2-cors');
const fs = require("fs");
const https = require("https");

app.use(cors());

const job = schedule.scheduleJob('0 * * * *', async function(){
    const response = await axios.get('https://www.rt.com/news/');
    const $ = cheerio.load(response.data);
    $('li.listCard-rows__item').each(async (i, element) => {
        let heading = $(element).find('div.list-card div.list-card__content div.list-card__content--title a.link.link_hover').text().replace(/\n/g, '');
        let paragraph = $(element).find('div.list-card div.list-card__content div.list-card__content--summary a.link_hover').text().replace(/\n/g, '');
        let date = $(element).find('div.list-card div.list-card__content div.card__date span.date').text().replace(/\n/g, '');

        // Проверяем, существует ли новость в базе данных
        const existingNews = await NEWS.findOne({ where: { Heading: heading } });
        if (!existingNews) {
            // Если новости нет в базе данных, добавляем ее
            await NEWS.create({ Heading: heading, Paragraph: paragraph, Date: date });
        }
    });
    console.log('✅ log: successful news parsing.');
});



app.use(router.routes());
app.use(newsRoutes.routes());


const options = {
    key:  fs.readFileSync('D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl\\LAB.key'),
    cert: fs.readFileSync('D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl\\LAB.crt')
};

const server = https.createServer(options, app.callback());
server.listen(port, () => console.log(`Сервер запущен на порту ${port}`));
