const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { USER } = require('../../database/models/user');
const { redisClient } = require('./../Redis/redisClient');
const { sendToQueue } = require("../RabbitMQ/sendToQueue");
const PROTO_PATH = process.env.APP_PORT == null ? "./../../Static/protos/auth.proto" : "./app/auth.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { });
const authPackage = grpc.loadPackageDefinition(packageDefinition).authPackage;

async function updatePassword(call, callback) {
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
        await redisClient.del(username);

        callback(null, { success: true, message: 'Password updated successfully' });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            details: 'Internal server error'
        });
    }
}

async function deleteUser(call, callback) {
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

        let messageData = {
            USERNAME: username,
            EMAIL: user.EMAIL,
            USER_ID: user.ID,
            MESSAGE: `Dear ${username},\n\nWe have received your request to delete your account in our application. We are very sorry that you have decided to leave us.\n\n` +
                "Your account has been successfully deleted and all your personal data has been completely deleted from our system in accordance with our privacy policy.\n" +
                "\nIf you accidentally requested account deletion or changed your mind, please contact us as soon as possible and we will try to help you.\n\n" +
                "We thank you for being with us and hope to see you again in the future. If you have any feedback or suggestions, we will be glad to hear them.\n\n" +
                "With respect,\nThe Lotus team"
        }

        sendToQueue('LastEmailNotificationQueue', messageData);

        await user.destroy();
        await redisClient.del(username);

        callback(null, { success: true, message: 'User successfully deleted' });
    }
    catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            details: 'Internal server error'
        });
    }
}

const server = new grpc.Server();

server.addService(authPackage.AuthenticationService.service, {
    UpdatePassword: updatePassword,
    DeleteUser: deleteUser
});

function startServer(grpcPort) {
    const TARGET = process.env.APP_PORT == null ? `0.0.0.0:${grpcPort}` : `0.0.0.0:${grpcPort}`; //todo ???
    server.bindAsync(TARGET, grpc.ServerCredentials.createInsecure(), (error, port) => {
        if (error) console.error(`🟥 gRPC server error: ${error.message}`);
        console.log(`🟩 gRPC server Successful`);
        server.start();
    });
}

module.exports = {
    startServer
};
