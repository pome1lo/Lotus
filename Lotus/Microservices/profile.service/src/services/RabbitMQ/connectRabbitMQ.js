const amqp = require('amqplib/callback_api');
const { USER: User } = require('./../../database/models/user');

const RABBITMQ_HOST = process.env.RABBITMQ_HOST || "localhost";
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || 5672;

function createChannel(connection, callback) {
    connection.createChannel(callback);
}

function consumeMessage(channel, queue) {
    channel.consume(queue, async function (msg) {
        const user = JSON.parse(msg.content.toString());
        await User.create({USERNAME: user.USERNAME, EMAIL: user.EMAIL});
    }, {
        noAck: true
    });
}

function connectRabbitMQ() {
    amqp.connect(`amqp://${RABBITMQ_HOST}:${RABBITMQ_PORT}`, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        createChannel(connection, function(error1, channel) {
            if (error1) {
                throw error1;
            }

            const queue = 'UserRegisteredQueue';

            channel.assertQueue(queue, {
                durable: false
            });

            consumeMessage(channel, queue);
        });
    });
}

module.exports = connectRabbitMQ;
