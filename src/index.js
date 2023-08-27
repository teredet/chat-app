import express from "express";
import http from 'http';
import { Server } from 'socket.io';


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', () => console.log('New WebSocket connection'))

server.listen(process.env.PORT, () => console.log(`Server is up on port: ${process.env.PORT}`))
