const express = require('express');
const app = express();
const path = require('path') 
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const cors = require('cors')
// // cors
app.use(cors())
// const index = require('./views')
// app.use(express.static(__dirname + '/public'));

// view engine 
// app.set('views',path.join(__dirname,'views'))
// app.set('view engine' , 'html')

// app.get('/' , (req , res) => {
//     res.send('index.html');
// })

const rooms = {}
app.get("/" , (req , res) => {
    io.on("connection" , socket => {
        socket.on("join room", roomID => {
            if(rooms[roomID]){
                rooms[roomID].push(socket.id);
            }
            else {
                rooms[roomID] = [socket.id];
            }
    
            const otherUser = rooms[roomID].find(id => id !== socket.id)
            
            if(otherUser) {
                socket.emit("other User" , otherUser);
                socket.to(otherUser).emit("user joined" , socket.id);
            }
        });
    
        socket.on("offer" , payload => {
            io.to(payload.target).emit("offer",payload);
        });
    
        socket.on("answer" , payload => {
            io.to(payload.target).emit("answer",payload);
        });
    
    
        // when 2 peers connect to each other firewall , ip , iceServer ~ turn / stun server use to create ice- candiate 
        socket.on("ice-candidate" , incoming => {
            io.to(incoming.target).emit("ice-canditate",incoming.candidate)
        })
    });
})



const PORT = 4000 || process.env.PORT
app.listen(PORT , () => console.log(`server started at ${PORT}`));