const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = process.env.APP_PORT == null ? "./../../Static/protos/auth.proto" : "./app/auth.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { });
const authPackage = grpc.loadPackageDefinition(packageDefinition).authPackage;
const GRPC_PORT_AUTH_SERVICE = process.env.GRPC_PORT_AUTH_SERVICE == null ? 19001 : process.env.GRPC_PORT_AUTH_SERVICE;

const TARGET = process.env.APP_PORT == null ? `0.0.0.0:${GRPC_PORT_AUTH_SERVICE}` : `authenticationwebapi:${GRPC_PORT_AUTH_SERVICE}`; //todo ???
const client = new authPackage.AuthenticationService(TARGET, grpc.credentials.createInsecure());


function updatePassword(id, password, salt) {
    return client.UpdatePassword({id, password, salt},  (error, response) => {
        if (error) { throw new Error(response.details); }
        else { console.log(response.success); }
    });
}

function deleteUser(id, password, salt) {
    return client.DeleteUser({id},  (error, response) => {
        if (error) { throw new Error(response.details); }
        else { console.log(response.success); }
    });
}



module.exports = {
    updatePassword,
    deleteUser
};