const Koa = require('koa');
const Router = require('@koa/router');
const jwt = require('koa-jwt');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
// const http = require('http');
const fs = require("fs");
const path = require("path");
const https = require("https");
// const http = require("http");


// const koaBody = require('koa-body').default;

const app = new Koa();
app.use(cors());


app.use(bodyParser());



const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';
const jwtMiddleware = jwt({ secret: SECRET_KEY, passthrough: true });
const isDocker = process.env.APP_PORT == null;
const PathToLAB = isDocker ? 'D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl' : '/app';
const router = new Router();

app.use(async (ctx, next) => {
    console.log(`⚙️: ${ctx.method} ${ctx.url}`);
    await next();
});

const proxyRequest = (ctx, target) => {
    return new Promise((resolve, reject) => {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });
        const options = {
            hostname: target.hostname,
            port: target.port,
            path: ctx.url,
            method: ctx.method,
            headers: ctx.request.header,
            agent: agent
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                ctx.status = res.statusCode;
                ctx.set(res.headers);
                ctx.body = data;
                resolve();
            });
        });

        req.on('error', (e) => {
            ctx.status = 500;
            console.log(e.message);
            ctx.body = 'Что-то пошло не так.';
            reject(e);
        });

        if (ctx.method !== 'GET') {
            // if (ctx.is('multipart/form-data')) {
            //     ctx.req.pipe(req);
            // } else {
                req.write(JSON.stringify(ctx.request.body));
            // }
        }
        req.end();
    });
};

router.all('/api/auth/(.*)', (ctx) => {
    return proxyRequest(ctx, { hostname: 'localhost', port: 31901 });
});

router.all('/api/news/(.*)', (ctx) => {
    return proxyRequest(ctx, { hostname: 'localhost', port: 31904 });
});

router.all('/api/profile/(.*)', jwtMiddleware, (ctx) => {
    return proxyRequest(ctx, { hostname: 'localhost', port: 31903 });
});

router.all('/api/notify/(.*)', jwtMiddleware, (ctx) => {
    return proxyRequest(ctx, { hostname: 'localhost', port: 31902 });
});

// Дебаг маршрут
router.get('/debug', async (ctx) => {
    ctx.status = 200;
    ctx.body = { message: 'SUCCESS' };
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.APP_PORT || 4000;


const options = {
    key:  fs.readFileSync(path.join(PathToLAB, 'LAB.key')),
    cert: fs.readFileSync(path.join(PathToLAB, 'LAB.crt'))
};

const server = https.createServer(options, app.callback());
server.listen(port, () => console.log(`API Gateway listening on port ${port}`));

// app.listen(port, () => { console.log(`API Gateway listening on port ${port}`); });