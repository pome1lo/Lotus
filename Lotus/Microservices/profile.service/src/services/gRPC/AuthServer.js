const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = getProtoPath();
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { });
const authPackage = grpc.loadPackageDefinition(packageDefinition).authPackage;
const GRPC_PORT_AUTH_SERVICE = getGrpcPort();
const TARGET = getTarget();
const client = new authPackage.AuthenticationService(TARGET, grpc.credentials.createInsecure());

function getProtoPath() {
    return process.env.APP_PORT == null ? "./../../Static/protos/auth.proto" : "./app/auth.proto";
}

function getGrpcPort() {
    return process.env.GRPC_PORT_AUTH_SERVICE == null ? 19001 : process.env.GRPC_PORT_AUTH_SERVICE;
}

function getTarget() {
    return process.env.APP_PORT == null ? `0.0.0.0:${GRPC_PORT_AUTH_SERVICE}` : `authenticationwebapi:${GRPC_PORT_AUTH_SERVICE}`;
}

function updatePassword(id, password, salt) {
    return client.UpdatePassword({id, password, salt},  (error, response) => {
        if (error) { throw new Error(response.message); }
        else { console.log(response.success); }
    });
}

function updateAccount(id, username) {
    return client.UpdateAccount({id, username},  (error, response) => {
        if (error) { throw new Error(response.message); }
        else { console.log(response.success); }
    });
}

function deleteUser(id) {
    return client.DeleteUser({id},  (error, response) => {
        if (error) { throw new Error(response.message); }
        else { console.log(response.success); }
    });
}

module.exports = {
    updatePassword,
    updateAccount,
    deleteUser
};
