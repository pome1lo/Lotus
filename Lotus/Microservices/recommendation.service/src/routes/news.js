const axios = require('axios');
const Router = require('koa-router');

const router = new Router();
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_OFFSET = 1;
const API_KEY = 'c8857ca5a88f4c6db7a26661057b6546';

async function fetchNews(ctx) {
    const { topic, limit, offset } = ctx.query;

    const pageSize = limit ? parseInt(limit, 10) : DEFAULT_PAGE_SIZE;
    const pageOffset = offset ? parseInt(offset, 10) : DEFAULT_PAGE_OFFSET;

    const url = `https://newsapi.org/v2/everything?q=${topic}&sortBy=publishedAt&pageSize=${pageSize}&page=${pageOffset}&apiKey=${API_KEY}`;

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
}

router.get('/api/news', fetchNews);

module.exports = router;
