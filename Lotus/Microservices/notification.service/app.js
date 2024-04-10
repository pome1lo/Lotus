const Koa = require('koa');
const port = 31004;
const cors = require('koa2-cors');
const emailRoutes = require('./src/routes/email');
const grpc = require('@grpc/grpc-js');
const grpcServer = require('./src/services/gRPC/grpcServer');
const grpcPort = 32001;

const app = new Koa();

app.use(cors());
app.use(emailRoutes.routes());

grpcServer.bindAsync(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) console.error(`Server error: ${error.message}`);
    grpcServer.start();
});

app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));
