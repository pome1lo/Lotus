const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = getProtoPath();
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { });
const notifyPackage = grpc.loadPackageDefinition(packageDefinition).notifyPackage;
const GRPC_PORT_NOTIFY_SERVICE = getGrpcPort();
const TARGET = getTarget();

const client = new notifyPackage.NotificationService(TARGET, grpc.credentials.createInsecure());

function getProtoPath() {
    return process.env.APP_PORT == null ? "./../../Static/protos/notify.proto" : "./app/notify.proto";
}

function getGrpcPort() {
    return process.env.GRPC_PORT_NOTIFY_SERVICE == null ? 19002 : process.env.GRPC_PORT_NOTIFY_SERVICE;
}

function getTarget() {
    return process.env.APP_PORT == null ? `0.0.0.0:${GRPC_PORT_NOTIFY_SERVICE}` : `notificationwebapi:${GRPC_PORT_NOTIFY_SERVICE}`;
}

function verifyEmail(username, email, message) {
    return client.VerifyEmail({username, email, message},  (error, response) => {
        if (error) { throw new Error(response.details); }
        else { console.log(response.success); }
    });
}

module.exports = {
    verifyEmail
};
