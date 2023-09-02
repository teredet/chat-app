import express from "express";
import http from 'http';
import { Server } from 'socket.io';

import { generateMessage } from './utils/messages.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    socket.emit('message', generateMessage('Welcome!'))
    socket.broadcast.emit('message', generateMessage('A new user has joined!'))

    socket.on('sendMessage', (message, callback) => {
        io.emit('message', generateMessage(message));
        callback('Delivered');
    })

    socket.on('sendLocation', (locObj, callback) => {
        io.emit('locationMessage', {
            url:`http://google.com/maps?q=${locObj.latitude},${locObj.longitude}`,
            timestamp: locObj.timestamp
        })
        callback('Success')
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left.'))
    })
})

server.listen(process.env.PORT, () => console.log(`Server is up on port: ${process.env.PORT}`))
