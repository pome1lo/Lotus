const amqp = require('amqplib/callback_api');

function sendToQueue(queue, message) {
    amqp.connect('amqp://localhost:5672', function(error0, connection) {
        if (error0) {
            console.error("Ошибка подключения к RabbitMQ:", error0);
            return;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                console.error("Ошибка создания канала в RabbitMQ:", error1);
                return;
            }

            channel.assertQueue(queue, {
                durable: false
            });

            const msgBuffer = Buffer.from(JSON.stringify(message));
            channel.sendToQueue(queue, msgBuffer);
            console.log("Сообщение отправлено в очередь", queue);

            setTimeout(() => {
                channel.close();
                connection.close();
            }, 500);
        });
    });
}

module.exports = { sendToQueue };