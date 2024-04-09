const Router = require('koa-router');
const { USER } = require('../database/models/user');
const { POST } = require('../database/models/post');
const util = require('util');
const crypto = require('crypto');
const argon2 = require('argon2');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = 'D:/FILES/University/3 course/2term/Course Project/Lotus/Static/protofile.proto';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const router = new Router();

const packageDefinition = protoLoader.loadSync(PROTO_PATH, { });
const authPackage = grpc.loadPackageDefinition(packageDefinition).authPackage;

const client = new authPackage.AuthenticationService('localhost:32001', grpc.credentials.createInsecure());


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
                console.log("📛📛📛");
                throw new Error(error.message);
            } else {
                console.log("✅✅✅");
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
                console.log("📛📛📛");
                throw new Error(error.message);
            } else {
                console.log("✅✅✅");
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