const Koa = require('koa');
const { createProxyMiddleware } = require('http-proxy-middleware');
const k2c = require('koa2-connect');
const Router = require('@koa/router');
const jwt = require('koa-jwt');
const bodyParser = require('koa-bodyparser');
const multer = require('@koa/multer');
const upload = multer();

const app = new Koa();
const router = new Router();

const SECRET_KEY = 'your_secret_key';

const jwtMiddleware = jwt({ secret: SECRET_KEY });


const profileProxyOptions = {
    target: 'https://localhost:31903',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
        if (req.headers.authorization) {
            proxyReq.setHeader('Authorization', req.headers.authorization);
        }
    },
    secure: false,
};

const profileProxy = createProxyMiddleware(profileProxyOptions);

app.use(bodyParser());

router.all('/api/profiles/(.*)', k2c(profileProxy));

app.use(router.routes()).use(router.allowedMethods());

const port = 4000;
app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}`);
});
