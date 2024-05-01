const amqp = require('amqplib/callback_api');
const { USER: User } = require('./../../database/models/notification');
const {NOTIFICATION} = require("../../database/Models/notification");
const {Mailer} = require("../mailer/mailer");

const RABBITMQ_HOST = process.env.RABBITMQ_HOST == null ? "localhost" : process.env.RABBITMQ_HOST;
const RABBITMQ_PORT = process.env.RABBITMQ_PORT == null ? 5672 : process.env.RABBITMQ_PORT;

function connectRabbitMQ() {
    amqp.connect(`amqp://${RABBITMQ_HOST}:${RABBITMQ_PORT}`, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            const NotifyUserRegisteredQueue = 'NotifyUserRegisteredQueue';
            const UserNotificationQueue = 'UserNotificationQueue';
            const SystemNotificationQueue = 'SystemNotificationQueue';
            const EmailNotificationQueue = 'EmailNotificationQueue';
            const LastEmailNotificationQueue = 'LastEmailNotificationQueue';

            channel.assertQueue(UserNotificationQueue, {
                durable: false
            });
            channel.assertQueue(SystemNotificationQueue, {
                durable: false
            });
            channel.assertQueue(EmailNotificationQueue, {
                durable: false
            });
            channel.assertQueue(NotifyUserRegisteredQueue, {
                durable: false
            });
            channel.assertQueue(LastEmailNotificationQueue, {
                durable: false
            });


            channel.consume(NotifyUserRegisteredQueue, async function (msg) {
                const data = JSON.parse(msg.content.toString());
                const user_id = data.USER_ID;
                const email = data.EMAIL;
                const username = data.USERNAME;
                Mailer.sendEmailUserRegistered(email, username);
                await NOTIFICATION.create({
                    AUTHOR: "System notification",
                    USER_ID: user_id,
                    CONTENT: "Welcome to Lotus! Hi! We are glad to welcome you to Lotus. You have successfully registered. Start enjoying all the benefits of Lotus right now!",
                    IMAGE: "system_notification.png",
                });
            }, {
                noAck: true
            });

            channel.consume(UserNotificationQueue, async function (msg) {
                const data = JSON.parse(msg.content.toString());
                await NOTIFICATION.create({
                    AUTHOR: data.AUTHOR,
                    USER_ID: data.USER_ID,
                    CONTENT: data.CONTENT,
                    IMAGE: data.IMAGE,
                });
            }, {
                noAck: true
            });

            channel.consume(SystemNotificationQueue, async function (msg) {
                const data = JSON.parse(msg.content.toString());
                const email = data.EMAIL;
                const user_id = data.USER_ID;
                const username = data.USERNAME;
                const message = data.MESSAGE;
                Mailer.sendEmailSystemNotification(email, username, message);
                await NOTIFICATION.create({
                    AUTHOR: "System notification",
                    CONTENT: message,
                    USER_ID: user_id,
                    IMAGE: "system_notification.png",
                });
            }, {
                noAck: true
            });

            channel.consume(EmailNotificationQueue, async function (msg) {
                const data = JSON.parse(msg.content.toString());
                const email = data.EMAIL;
                const username = data.USERNAME;
                const message = data.MESSAGE;
                Mailer.sendEmailMessage(email, username, message);
            }, {
                noAck: true
            });

            channel.consume(LastEmailNotificationQueue, async function (msg) {
                const data = JSON.parse(msg.content.toString());
                const email = data.EMAIL;
                const user_id = data.USER_ID;
                const username = data.USERNAME;
                const message = data.MESSAGE;
                Mailer.sendEmailMessage(email, username, message);
                await NOTIFICATION.destroy({
                    where: {
                        USER_ID: user_id
                    }
                });
            }, {
                noAck: true
            });
        });
    });
}


module.exports = connectRabbitMQ;
