const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const userAccountRoutes = require('./src/routes/account');
const googleRoutes = require('./src/routes/google');
const githubRoutes = require('./src/routes/github');
const port = 31002;
const grpcPort = 32001;
const app = new Koa();
const cors = require('koa2-cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = 'D:/FILES/University/3 course/2term/Course Project/Lotus/Static/auth.proto';
const { USER } = require('./src/database/models/user');
const redis = require("redis");
const session = require("koa-session");
const passport = require("koa-passport");

app.keys = ['your-secret']; //todo add secret in config
app.use(session({}, app));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(bodyParser());

app.use(userAccountRoutes.routes());
app.use(googleRoutes.routes());
app.use(githubRoutes.routes());

// Загрузка файла proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { });
const authPackage = grpc.loadPackageDefinition(packageDefinition).authPackage;

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

const client = redis.createClient(`redis://${REDIS_HOST}:${REDIS_PORT}`);
client.connect();
const updatePassword = async (call, callback) => {
    const { id, password, salt } = call.request;

    try {
        const user = await USER.findByPk(id);
        if (!user) {
            return callback({
                code: grpc.status.NOT_FOUND,
                details: 'User not found'
            });
        }

        const username = user.USERNAME;

        user.PASSWORD = password;
        user.SALT = salt;
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
        const user = await USER.findByPk(id);
        if (!user) {
            return callback({
                code: grpc.status.NOT_FOUND,
                details: 'User not found'
            });
        }

        const username = user.USERNAME;

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


app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));
