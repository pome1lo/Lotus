const Koa = require('koa');
const { createProxyMiddleware } = require('http-proxy-middleware');
const k2c = require('koa2-connect');
const Router = require('@koa/router');
const jwt = require('koa-jwt');
const bodyParser = require('koa-bodyparser');
const multer = require('@koa/multer');
const fs = require("fs");
const path = require("path");
const https = require("https");
const upload = multer();
const port = process.env.APP_PORT || 4000;
const isDocker = process.env.APP_PORT == null;

const app = new Koa();
const router = new Router();

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

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
const authProxyOptions = {
    target: 'https://localhost:31901',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
        if (req.headers.authorization) {
            proxyReq.setHeader('Authorization', req.headers.authorization);
        }
    },
    secure: false,
};
const notifyProxyOptions = {
    target: 'https://localhost:31902',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
        if (req.headers.authorization) {
            proxyReq.setHeader('Authorization', req.headers.authorization);
        }
    },
    secure: false,
};
const newsProxyOptions = {
    target: 'https://localhost:31904',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
        if (req.headers.authorization) {
            proxyReq.setHeader('Authorization', req.headers.authorization);
        }
    },
    secure: false,
};

const profileProxy = createProxyMiddleware(profileProxyOptions);
const authProxy = createProxyMiddleware(authProxyOptions);
const notifyProxy = createProxyMiddleware(notifyProxyOptions);
const newsProxy = createProxyMiddleware(newsProxyOptions);

app.use(bodyParser());

router.all('/api/profile/(.*)', k2c(profileProxy));
router.all('/api/notify/(.*)', k2c(notifyProxy));
router.all('/api/news/(.*)', k2c(newsProxy));
router.all('/api/auth/(.*)', k2c(authProxy));

router.get('/debug', async (ctx) => {
    ctx.status = 200;
    ctx.body = { message:  'SUCCESS'};
});

app.use(router.routes()).use(router.allowedMethods());

const PathToLAB = isDocker ? 'D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl' : '/app';

const options = {
    key:  fs.readFileSync(path.join(PathToLAB, 'LAB.key')),
    cert: fs.readFileSync(path.join(PathToLAB, 'LAB.crt'))
};


const server = https.createServer(options, app.callback());
server.listen(port, () => console.log(`API Gateway listening on port  ${port}`));

