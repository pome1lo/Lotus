const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const {Mailer} = require("../mailer/mailer");
const PROTO_PATH = process.env.APP_PORT == null ? "./../../Static/protos/notify.proto" : "./app/notify.proto";

const verifyEmail = async (call, callback) => {
    const {  username, email, message } = call.request;
    Mailer.sendEmailMessage(email, "Email verification", username, message);
    try {
        callback(null, { success: true, message: `successfully ${message}` });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            details: 'GRPC: Internal server error'
        });
    }
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, { });
const notifyPackage = grpc.loadPackageDefinition(packageDefinition).notifyPackage;

const server = new grpc.Server();
server.addService(notifyPackage.NotificationService.service, {
    VerifyEmail: verifyEmail,
});

module.exports = server;
