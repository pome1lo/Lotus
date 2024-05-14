const axios = require('axios');
const cheerio = require('cheerio');
const { NEWS} = require('./../../database/models/news');
const cron = require("node-cron");

function scheduleJob(topic) {
    cron.schedule('0 * * * *', async () => {
        try {
            const response = await axios.get(`https://ria.ru/${topic}/`);
            const $ = cheerio.load(response.data);

            $('.list-item__title').each(async (index, element) => {
                if (index >= 20) {
                    return false;
                }
                const title = $(element).text();
                const link = $(element).attr('href');
                const image = $('.responsive_img.m-list-img').eq(index).attr('src');
                const alt = $('.responsive_img.m-list-img').eq(index).attr('alt');
                const date = $('.list-item__date').eq(index).text();

                await NEWS.create({
                    TITLE: title,
                    PARAGRAPH: alt,
                    ALT: alt,
                    LINK: link,
                    IMAGE: image,
                    DATE: date,
                    TOPIC_NAME: topic
                });
            });

        } catch (error) {
            console.error('Parser error: ' + error.message);
        }
    });
}

module.exports = scheduleJob;
