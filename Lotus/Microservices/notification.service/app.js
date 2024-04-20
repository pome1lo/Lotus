const Koa = require('koa');
const cors = require('koa2-cors');
const emailRoutes = require('./src/routes/email');
const grpc = require('@grpc/grpc-js');
const grpcServer = require('./src/services/gRPC/grpcServer');
const grpcPort = process.env.GRPC_PORT == null ? 19002 : process.env.GRPC_PORT;
const fs = require('fs');
const https = require('https');
const path = require("path");
const port = process.env.APP_PORT == null ? 31902 : process.env.APP_PORT;
const app = new Koa();

app.use(cors());
app.use(emailRoutes.routes());

grpcServer.bindAsync(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) console.error(`🟥 gRPC server error: ${error.message}`);
    console.log(`🟩 gRPC server Successful`);
    grpcServer.start();
});


const isDocker = process.env.APP_PORT == null;
const PathToLAB = isDocker ? '/app' : 'D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\ssl';

const options = {
    key:  fs.readFileSync(path.join(PathToLAB, 'LAB.key')),
    cert: fs.readFileSync(path.join(PathToLAB, 'LAB.crt'))
};


const server = https.createServer(options, app.callback());
server.listen(port, () => console.log(`🟩 Authentication server running: port-${port}`));

