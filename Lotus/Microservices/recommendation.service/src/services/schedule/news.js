const schedule = require('node-schedule');
const axios = require('axios');
const cheerio = require('cheerio');
const NEWS = require('./../../database/models/news');

function scheduleJob() {
    schedule.scheduleJob('* * * * *', async function(){
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
}

module.exports = scheduleJob;