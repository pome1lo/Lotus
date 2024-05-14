const socketIo = require('socket.io');
let io;

const initializeSocketIo = (server) => {
    io = socketIo(server, {
        cors: {
            origin: 'http://localhost:3000',
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
            const USER_ID = data.user_id;

            const DATA = {
                time: getCurrentTime(),
                author: "{author}",
                image: "",
                message: "хуем полбу?"
            }


            io.emit(`new_comment_${USER_ID}`, DATA);
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
