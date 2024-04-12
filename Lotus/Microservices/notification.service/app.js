const Koa = require('koa');
const port = 31004;
const cors = require('koa2-cors');
const emailRoutes = require('./src/routes/email');
const grpc = require('@grpc/grpc-js');
const grpcServer = require('./src/services/gRPC/grpcServer');
const grpcPort = 32001;
const fs = require('fs');
const https = require('https');

const app = new Koa();

app.use(cors());
app.use(emailRoutes.routes());

grpcServer.bindAsync(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) console.error(`🟥 gRPC server error: ${error.message}`);
    console.log(`🟩 gRPC server Successful`);
    grpcServer.start();
});


const options = {
    key:  fs.readFileSync('D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl\\LAB.key'),
    cert: fs.readFileSync('D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl\\LAB.crt')
};

const server = https.createServer(options, app.callback());
server.listen(port, () => console.log(`🟩 Authentication server running: port-${port}`));

