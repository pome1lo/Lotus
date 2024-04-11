const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { USER } = require('../../database/models/user');
const redis = require("redis");
const PROTO_PATH = 'D:/FILES/University/3 course/2term/Course Project/Lotus/Static/auth.proto';

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



module.exports = {
    startServer: (grpcPort) => {
        const TARGET = process.env.APP_PORT == null ? `profilewebapi:${grpcPort}` : `0.0.0.0:${grpcPort}`;
        server.bindAsync(TARGET, grpc.ServerCredentials.createInsecure(), (error, port) => {
            if (error) {
                console.error(`Server error: ${error.message}`);
            }
            server.start();
        });
    }
};
