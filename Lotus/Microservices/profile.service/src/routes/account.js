const Router = require('koa-router');
const { USER } = require('../database/models/user');
const { POST } = require('../database/models/post');
const util = require('util');
const crypto = require('crypto');
const argon2 = require('argon2');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const koaJwt = require('koa-jwt');
const PROTO_PATH = process.env.APP_PORT == null ? "./../../Static/protos/auth.proto" : "./../../app/auth.proto";
const GRPC_PORT_AUTH_SERVICE = process.env.GRPC_PORT_AUTH_SERVICE == null ? 19001 : process.env.GRPC_PORT_AUTH_SERVICE;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const secretKey = 'your-secret-key'; //todo add data in config | docker

const router = new Router();

const packageDefinition = protoLoader.loadSync(PROTO_PATH, { });
const authPackage = grpc.loadPackageDefinition(packageDefinition).authPackage;

const TARGET = process.env.APP_PORT == null ? `0.0.0.0:${GRPC_PORT_AUTH_SERVICE}` : `authenticationwebapi:${GRPC_PORT_AUTH_SERVICE}`; //todo ???
const client = new authPackage.AuthenticationService(TARGET, grpc.credentials.createInsecure());


router.get('/api/account/protected', koaJwt({ secret: secretKey }), async (ctx) => {
    ctx.body = { message: 'Вы успешно прошли аутентификацию!' };
});

router.post('/api/account/personal', async (ctx) => {
    const { id, username, firstname, lastname, birth_date } = ctx.request.body;

    try {
        const user = await USER.findByPk(id);

        if (!user) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }

        user.USERNAME = username || user.USERNAME;
        user.FIRSTNAME = firstname || user.FIRSTNAME;
        user.LASTNAME = lastname || user.LASTNAME;
        user.BIRTH_DATE = birth_date || user.BIRTH_DATE;

        await user.save();

        ctx.status = 200;
        ctx.body = { message: 'User updated successfully' };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
});

router.post('/api/account/security', async (ctx) => {
    const { id, email, phone_number, password } = ctx.request.body;

    try {
        const user = await USER.findByPk(id);
        if (!user) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }

        user.EMAIL = email || user.EMAIL;
        user.PHONE_NUMBER = phone_number || user.PHONE_NUMBER;

        const salt = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await argon2.hash(password + salt);


        client.UpdatePassword({ id: id, password: hashedPassword, salt: salt }, (error, response) => {
            if (error) {
                throw new Error(error.message);
            }
        });
        await user.save();

        ctx.status = 200;
        ctx.body = { message: 'User updated successfully' };

    } catch (error) {
        console.log(error);
        if (error.code === grpc.status.NOT_FOUND) {
            ctx.status = 404;
            ctx.body = { error: 'Authentication service: User not found' };
        } else {
            ctx.status = 500;
            ctx.body = { error: 'Something went wrong' };
        }
    }

});

router.delete('/api/account/delete', async (ctx) => {
    const { id } = ctx.request.body;

    try {
        const user = await USER.findByPk(id);

        if (!user) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }

        client.DeleteUser({ id: id }, (error, response) => {
            if (error) {
                throw new Error(error.message);
            }
        });

        const posts = await POST.findAll({ where: { USER_ID: { [Op.eq]: id } } });
        for (let post of posts) {
            await post.destroy();
        }

        await user.destroy();

        ctx.status = 200;
        ctx.body = { message: 'User deleted successfully' };
    } catch (error) {
        console.log(error.message);
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
});


module.exports = router;