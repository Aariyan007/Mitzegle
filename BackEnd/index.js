import http from 'http';
import { Server } from 'socket.io';
import {v4 as uuid} from 'uuid';
const server = http.createServer();
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 8000;
const io = new Server(server,{
    cors:{origin: "*"}
});

const waiting = [];
const activePairs = new Map(); // user a : user b

// console.log("Server is running...");
io.on('connection',(socket)=>{
    console.log(socket.id);
    socket.on("name",()=>{
        if(waiting.length > 0){
            const partner = waiting.shift();
            const roomId = uuid();
            activePairs.set(socket.id,partner);
            activePairs.set(partner,socket.id);
            socket.emit("Matched : ",{roomId});
            socket.to(partner).emit("Matched : ",{roomId});
        }
        else{
            waiting.push(socket.id);
        }
    })
});


server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})