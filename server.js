const { createServer } = require('http');
const { Server } = require('socket.io');

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: '*', // Permite conexões do GitHub Pages
        methods: ['GET', 'POST']
    }
});

let messages = [];
let userCount = 0;

io.on('connection', (socket) => {
    userCount++;
    io.emit('userCount', userCount);

    socket.emit('message', ...messages);

    socket.on('message', (data) => {
        messages.push(data);
        if (messages.length > 50) messages.shift(); // Limita a 50 mensagens
        io.emit('message', data);
    });

    socket.on('clearChat', () => {
        messages = [];
        io.emit('clearChat');
    });

    socket.on('disconnect', () => {
        userCount--;
        io.emit('userCount', userCount);
    });
});

server.listen(process.env.PORT || 6001);