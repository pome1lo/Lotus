const socketIo = require('socket.io');
const {sendToQueue} = require("../RabbitMQ/sendToQueue");
let io;

const initializeSocketIo = (server) => {
    io = socketIo(server, {
        cors: {
            origin: 'https://localhost:3000',
            methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('😉 Клиент подключен');

        socket.on('disconnect', () => {
            console.log('Клиент отключен');
        });

        socket.on('comment', (data) => {
            const POST_USERNAME = data.post_username;
            const COMMENT_USERNAME = data.comment_username;
            const USER_ID = data.user_id;
            const IMAGE = data.profile_picture;
            const MESSAGE = `${POST_USERNAME}, you have a new comment from ${COMMENT_USERNAME}.`;
            sendToQueue('UserNotificationQueue', {
                AUTHOR: COMMENT_USERNAME,
                USER_ID: USER_ID,
                CONTENT: MESSAGE,
                IMAGE: IMAGE
            });

            const DATA = {
                time: getCurrentTime(),
                author: COMMENT_USERNAME,
                image: IMAGE,
                message: MESSAGE
            }
            const CHANEL_NAME = `new_comment_${POST_USERNAME}`;
            io.emit(CHANEL_NAME, DATA);
        })
    });


    return io;
};

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

module.exports = { initializeSocketIo, io };
