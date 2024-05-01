const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const userAccountRoutes = require('./src/routes/account');
const googleRoutes = require('./src/routes/google');
const githubRoutes = require('./src/routes/github');
const port = process.env.APP_PORT == null ? 31901 : process.env.APP_PORT;
const grpcPort = process.env.GRPC_PORT == null ? 19001 : process.env.GRPC_PORT;
const app = new Koa();
const cors = require('koa2-cors');
const session = require("koa-session");
const passport = require("koa-passport");
const grpcServer = require('./src/services/gRPC/grpcServer');
const fs = require("fs");
const https = require("https");
const path = require("path");
const {sendToQueue} = require("./src/services/RabbitMQ/sendToQueue");

app.keys =  [ process.env.SECRET_KEY == null ? 'secret_key' : process.env.SECRET_KEY ];

app.use(session({}, app));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(bodyParser());

app.use(userAccountRoutes.routes());
app.use(googleRoutes.routes());
app.use(githubRoutes.routes());

grpcServer.startServer(grpcPort);

const isDocker = process.env.APP_PORT == null;
const PathToLAB = isDocker ? 'D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl' : '/app';

const options = {
    key:  fs.readFileSync(path.join(PathToLAB, 'LAB.key')),
    cert: fs.readFileSync(path.join(PathToLAB, 'LAB.crt'))
};


const server = https.createServer(options, app.callback());
server.listen(port, () => console.log(`🟩 Authentication server running: port-${port}`));
