// news.js
module.exports = (router) => {
    router.get('news', '/news', (ctx) => { 
        ctx.body = {
            news: [
                {
                    title: 'Новость 1',
                    content: 'Содержание новости 1'
                },
                {
                    title: 'Новость 2',
                    content: 'Содержание новости 2'
                }
            ]
        };
    });
};
