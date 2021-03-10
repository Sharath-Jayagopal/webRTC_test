const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
    cors:true,
    urls:["http://localhost:3002"]
})

// cors
// s

const rooms = {}

io.on("connection",(socket) => {
    console.log('joined room !!!!!!!!!!!')

    socket.on('join room',(roomName) => {
        console.log('new User joined in ',roomName)
        socket.join(roomName)
        socket.to(roomName).emit('user joined' , socket.id)
    })

    socket.on('disconnect',()=>{
        console.log('user left chat, '+ socket.id)
    })

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer",payload)
    })

    socket.on("answer",payload => {
        io.to(payload.target).emit("answer",payload)
    })

    socket.on("ice-candidate", incoming => {
        // console.log(incoming)
        io.to(incoming.target).emit("onIceCandidate",incoming)
        console.log("ice candidate connected")
    })


})

server.listen(3100,() => console.log('server up !!!!!!'))
