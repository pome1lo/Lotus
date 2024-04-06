const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const userAccountRoutes = require('./src/routes/userAccount');
const googleRoutes = require('./src/routes/google');
const port = 31002;
const grpcPort = 32001;
const authApp = new Koa();
const cors = require('koa2-cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = 'D:/FILES/University/3 course/2term/Course Project/Lotus/Static/protofile.proto';
const { USER: User } = require('./src/database/models/user');
const redis = require("redis");

authApp.use(cors());
authApp.use(bodyParser());

authApp.use(userAccountRoutes.routes());
authApp.use(googleRoutes.routes());

// Загрузка файла proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { });
const authPackage = grpc.loadPackageDefinition(packageDefinition).authPackage;
const client = redis.createClient("redis://localhost:6379");
client.connect();
const updatePassword = async (call, callback) => {
    const { id, password, salt } = call.request;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return callback({
                code: grpc.status.NOT_FOUND,
                details: 'User not found'
            });
        }

        const username = user.username;

        user.password = password;
        user.salt = salt;
        await user.save();
        await client.del(username);

        callback(null, { success: true, message: 'Password updated successfully' });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            details: 'Internal server error'
        });
    }
};

const deleteUser = async (call, callback) => {
    const { id } = call.request;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return callback({
                code: grpc.status.NOT_FOUND,
                details: 'User not found'
            });
        }

        const username = user.username;

        await user.destroy();
        await client.del(username);

        callback(null, { success: true, message: 'User successfully deleted' });
    }
    catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            details: 'Internal server error'
        });
    }
};

const server = new grpc.Server();
server.addService(authPackage.AuthenticationService.service, {
    UpdatePassword: updatePassword,
    DeleteUser: deleteUser
});

server.bindAsync(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error(`Server error: ${error.message}`);
    }
    server.start();
});


authApp.listen(port, () => console.log(`Сервер запущен на порту ${port}`));
