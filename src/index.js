import express from "express";
import http from 'http';
import { Server } from 'socket.io';


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message, callback) => {
        io.emit('message', message);
        callback('Delivered');
    })

    socket.on('sendLocation', (locObj, callback) => {
        socket.broadcast.emit('message', `http://google.com/maps?q=${locObj.latitude},${locObj.longitude}`)
        callback('Success')
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left.')
    })
})

server.listen(process.env.PORT, () => console.log(`Server is up on port: ${process.env.PORT}`))
