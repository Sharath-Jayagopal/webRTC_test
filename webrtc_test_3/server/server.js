const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
    cors:true,
    urls:["http://localhost:3000"]
})

io.on("connection", socket => {
    console.log("socket connected")

    socket.on('join room',(roomName) => {
        console.log("user joined room : " , roomName);
        socket.join(roomName);
        socket.to(roomName).emit('user joined' , socket.id)
    })

    // offer
    socket.on('offer',payload => {
        console.log("Offer Payload : ")
        // console.log(payload)
        io.to(payload.target).emit('offer',payload)
    })
    // answer
    socket.on('answer',payload => {
        console.log("Answer Payload : ")
        // console.log(payload)
        io.to(payload.target).emit('answer' , payload)
    })

    // onicecandidate
    socket.on('ice candidate', payload => {
        console.log("ice candidate Payload : ")
        // console.log(payload)
        io.to(payload.target).emit('ice candidate' , payload)
    })
})




server.listen(3001,() => console.log("server is up"))
