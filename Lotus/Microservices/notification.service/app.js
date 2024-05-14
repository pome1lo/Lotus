const Koa = require('koa');
const cors = require('koa2-cors');
const emailRoutes = require('./src/routes/email');
const grpc = require('@grpc/grpc-js');
const grpcServer = require('./src/services/gRPC/grpcServer');
const fs = require('fs');
const https = require('https');
const path = require("path");
const connectRabbitMQ = require("./src/services/RabbitMQ/connectRabbitMQ");
const {initializeSocketIo} = require("./src/services/Socket/socket");

const GRPC_PORT = process.env.GRPC_PORT || 19002;
const APP_PORT = process.env.APP_PORT || 31902;
const SSL_PATH = process.env.APP_PORT ? '/app' : 'D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl';

const app = new Koa();
app.use(cors());

app.use(emailRoutes.routes());

grpcServer.bindAsync(`0.0.0.0:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error(`🟥 gRPC server error: ${error.message}`);
    } else {
        console.log(`🟩 gRPC server Successful`);
        grpcServer.start();
    }
});

const sslOptions = {
    key:  fs.readFileSync(path.join(SSL_PATH, 'LAB.key')),
    cert: fs.readFileSync(path.join(SSL_PATH, 'LAB.crt'))
};

const server = https.createServer(sslOptions, app.callback());
initializeSocketIo(server);
server.listen(APP_PORT, () => console.log(`🟩 Authentication server running: port-${APP_PORT}`));
// app.listen(APP_PORT, () => console.log(`🟩 Authentication server running: port-${APP_PORT}`));

connectRabbitMQ();
