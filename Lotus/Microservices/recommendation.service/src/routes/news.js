const axios = require('axios');
const Router = require('koa-router');
const router = new Router();

router.get('/api/news', async (ctx) => {
    const { topic, limit, offset } = ctx.query;
    // Обеспечиваем наличие значений по умолчанию для limit и offset
    const pageSize = limit ? parseInt(limit, 10) : 20; // Значение по умолчанию, если limit не указан
    const pageOffset = offset ? parseInt(offset, 10) : 1; // Значение по умолчанию, если offset не указан

    // Добавляем параметры пагинации в URL запроса
    const url = `https://newsapi.org/v2/everything?q=${topic}&sortBy=publishedAt&pageSize=${pageSize}&page=${pageOffset}&apiKey=48d693b19a91428ca31c34af0b07d794`;

    try {
        const response = await axios.get(url);
        const articles = response.data.articles.map(article => ({
            author: article.author,
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            content: article.content
        }));

        ctx.body = {
            articles: articles,
            page: pageOffset,
            pageSize: pageSize,
            totalCount: response.data.totalResults
        };
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = 'Ошибка при получении новостей';
    }
});


module.exports = router;
