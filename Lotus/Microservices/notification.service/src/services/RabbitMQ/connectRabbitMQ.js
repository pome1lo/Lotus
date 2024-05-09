const amqp = require('amqplib/callback_api');
const { NOTIFICATION } = require("../../database/Models/notification");
const { Mailer } = require("../mailer/mailer");

const RABBITMQ_HOST = process.env.RABBITMQ_HOST || "localhost";
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || 5672;

const QUEUES = {
    NotifyUserRegisteredQueue: 'NotifyUserRegisteredQueue',
    UserNotificationQueue: 'UserNotificationQueue',
    SystemNotificationQueue: 'SystemNotificationQueue',
    EmailNotificationQueue: 'EmailNotificationQueue',
    LastEmailNotificationQueue: 'LastEmailNotificationQueue',
    SupportEmailNotificationQueue: 'SupportEmailNotificationQueue'
};

function connectRabbitMQ() {
    amqp.connect(`amqp://${RABBITMQ_HOST}:${RABBITMQ_PORT}`, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            Object.values(QUEUES).forEach(queue => {
                channel.assertQueue(queue, { durable: false });
            });

            channel.consume(QUEUES.NotifyUserRegisteredQueue, async function (msg) {
                const { USER_ID: user_id, EMAIL: email, USERNAME: username } = JSON.parse(msg.content.toString());
                Mailer.sendEmailUserRegistered(email, username);
                await NOTIFICATION.create({
                    AUTHOR: "System notification",
                    USER_ID: user_id,
                    CONTENT: "Welcome to Lotus! Hi! We are glad to welcome you to Lotus. You have successfully registered. Start enjoying all the benefits of Lotus right now!",
                    IMAGE: "system_notification.png",
                });
            }, { noAck: true });

            channel.consume(QUEUES.UserNotificationQueue, async function (msg) {
                const { AUTHOR, USER_ID, CONTENT, IMAGE } = JSON.parse(msg.content.toString());
                await NOTIFICATION.create({ AUTHOR, USER_ID, CONTENT, IMAGE });
            }, { noAck: true });

            channel.consume(QUEUES.SystemNotificationQueue, async function (msg) {
                const { EMAIL: email, USER_ID: user_id, USERNAME: username, MESSAGE: message } = JSON.parse(msg.content.toString());
                Mailer.sendEmailSystemNotification(email, username, message);
                await NOTIFICATION.create({
                    AUTHOR: "System notification",
                    CONTENT: message,
                    USER_ID: user_id,
                    IMAGE: "system_notification.png",
                });
            }, { noAck: true });

            channel.consume(QUEUES.EmailNotificationQueue, async function (msg) {
                const { EMAIL: email, USERNAME: username, MESSAGE: message } = JSON.parse(msg.content.toString());
                Mailer.sendEmailMessage(email, username, message);
            }, { noAck: true });

            channel.consume(QUEUES.LastEmailNotificationQueue, async function (msg) {
                const { EMAIL: email, USER_ID: user_id, USERNAME: username, MESSAGE: message } = JSON.parse(msg.content.toString());
                Mailer.sendEmailMessage(email, username, message);
                await NOTIFICATION.destroy({ where: { USER_ID: user_id } });
            }, { noAck: true });

            channel.consume(QUEUES.SupportEmailNotificationQueue, async function (msg) {
                const { EMAIL: email, USERNAME: username, PROBLEM_MESSAGE: message } = JSON.parse(msg.content.toString());
                Mailer.sendSupportEmailMessage(email, username, message);
            }, { noAck: true });
        });
    });
}

module.exports = connectRabbitMQ;
