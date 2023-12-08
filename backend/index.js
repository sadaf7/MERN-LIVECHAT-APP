const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToMongo = require('./config/db')
const { notFound, errorHandler } = require('../backend/middleware/errorMiddleware');
const { Socket } = require("socket.io");

dotenv.config();

const app = express();
connectToMongo()

const port =  2000

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:false}))

app.use('/api/user',require('./routes/userRoutes'))
app.use('/api/chat',require('./routes/chatRoutes'))
app.use('/api/message',require('./routes/messageRoutes'))

app.use(notFound)
app.use(errorHandler)



const server = app.listen(port, () => {
    console.log(` App started on port ${port}`);
});

const io = require('socket.io')(server,{
  pingTimeout: 60000,
  cors:{
    origin: "http://localhost:3000"
  }
})
io.on('connection',(socket)=>{
  console.log('Connected to socket.io')

  socket.on("setup",(userData)=>{
    socket.join(userData._id)
    console.log(userData._id)
    socket.emit("Connected")
  })

  socket.on("join chat",(room)=>{
    socket.join(room)
    console.log("user joined room "+room)
  })

  socket.on("new message",(newMessageRecieved)=>{
    var chat = newMessageRecieved.chat;
    if(!chat.users){
      return (
        console.log('chat.users not defined')
      )
    }

    chat.users.forEach((user) => {
      if(user._id === newMessageRecieved.sender._id){
        return
      }
      socket.in(user._id).emit('message recieved',newMessageRecieved)
    });

  })

  socket.on("typing",(room)=> socket.in(room).emit("typing"))
  socket.on("stop typing",(room)=> socket.in(room).emit("stop typing"))

  socket.off("setup",()=>{
    console.log("setup off")
    socket.leave(userData._id)
  })
})