import http from 'http';
import { Server } from 'socket.io';
const server = http.createServer();
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 8000;
const io = new Server(server,{
    cors:{origin: "*"}
});
// console.log("Server is running...");
io.on('connection',(socket)=>{
    console.log(socket.id);
});


server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})