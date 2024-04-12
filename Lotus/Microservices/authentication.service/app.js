const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const userAccountRoutes = require('./src/routes/account');
const googleRoutes = require('./src/routes/google');
const githubRoutes = require('./src/routes/github');
const port = 31002;
const grpcPort = 19001;
const app = new Koa();
const cors = require('koa2-cors');
const session = require("koa-session");
const passport = require("koa-passport");
const grpcServer = require('./src/services/gRPC/grpcServer');
const fs = require("fs");
const https = require("https");

app.keys = ['your-secret']; //todo add secret in config
app.use(session({}, app));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(bodyParser());

app.use(userAccountRoutes.routes());
app.use(googleRoutes.routes());
app.use(githubRoutes.routes());

grpcServer.startServer(grpcPort);

const options = {
    key:  fs.readFileSync('D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl\\LAB.key'),
    cert: fs.readFileSync('D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl\\LAB.crt')
};

const server = https.createServer(options, app.callback());
server.listen(port, () => console.log(`🟩 Authentication server running: port-${port}`));

