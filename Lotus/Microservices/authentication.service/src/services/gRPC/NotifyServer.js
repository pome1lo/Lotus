const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = process.env.APP_PORT == null ? "./../../Static/protos/notify.proto" : "./app/notify.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { });
const notifyPackage = grpc.loadPackageDefinition(packageDefinition).notifyPackage;
const GRPC_PORT_NOTIFY_SERVICE = process.env.GRPC_PORT_NOTIFY_SERVICE == null ? 19002 : process.env.GRPC_PORT_NOTIFY_SERVICE;

const TARGET = process.env.APP_PORT == null ? `0.0.0.0:${GRPC_PORT_NOTIFY_SERVICE}` : `notificationwebapi:${GRPC_PORT_NOTIFY_SERVICE}`; //todo ???
const client = new notifyPackage.NotificationService(TARGET, grpc.credentials.createInsecure());

function verifyEmail(username, email, message) {
    return client.VerifyEmail({username, email, message},  (error, response) => {
        if (error) { throw new Error(response.details); }
        else { console.log(response.success); }
    });
}

module.exports = {
    verifyEmail
};