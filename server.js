const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// Store connected users and their actions
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('joinGlobal', () => {
        socket.join('global');
        connectedUsers.set(socket.id, { room: 'global' });
        console.log(`User ${socket.id} joined global room`);
    });

    socket.on('leaveGlobal', () => {
        socket.leave('global');
        connectedUsers.delete(socket.id);
        console.log(`User ${socket.id} left global room`);
    });

    socket.on('toggleCheckbox', (data) => {
        const user = connectedUsers.get(socket.id);
        if (user && user.room === 'global') {
            socket.to('global').emit('checkboxToggled', data);
        }
    });

    socket.on('disconnect', () => {
        connectedUsers.delete(socket.id);
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
