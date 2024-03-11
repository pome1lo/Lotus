'use strict';
const Koa = require('koa');
const app = new Koa();
const Router = require('@koa/router');
const router = new Router();
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const schedule = require('node-schedule');
const {DataTypes, Sequelize} = require("sequelize");




const sequelize = new Sequelize('RECOMMENDATION_SERVICE', 'sa', 'sa', {
    host: 'localhost',
    dialect: 'mssql',
    dialectOptions: {
        options: {
            trustServerCertificate: true,
        },
    },
});

const NEWS = sequelize.define('NEWS', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Heading: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Paragraph: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Date: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});


const job = schedule.scheduleJob('*/10 * * * * *', async function(){
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
    console.log('Это сообщение выводится каждые 10 секунды');
});

router.get('/news', async ctx => {
    ctx.body = await NEWS.findAll();
});

app.use(router.routes());
app.listen(3000);
