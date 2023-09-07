import express from "express";
import http from 'http';
import { Server } from 'socket.io';

import { generateMessage } from './utils/messages.js';
import { addUser, removeUser, getUser, getUsersInRoom } from "./utils/users.js";


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });
        if (error) return callback(error);

        socket.join(user.room);

        socket.emit('message', generateMessage('Welcome!', 'System'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`, 'System'))

        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', generateMessage(message, user.username));
        callback('Delivered');
    })

    socket.on('sendLocation', (locObj, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('locationMessage', {
            author: user.username,
            url: `http://google.com/maps?q=${locObj.latitude},${locObj.longitude}`,
            timestamp: locObj.timestamp
        })
        callback('Success')
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) io.to(user.room).emit('message', generateMessage(`${user.username} has left.`))
    })
})

server.listen(process.env.PORT, () => console.log(`Server is up on port: ${process.env.PORT}`))
