
const express = require('express');
//const session = require('express-session');
//const FileStore = require('session-file-store')(session);
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Message = require('./models/Message');
//const passport = require('passport');




const app = express();
const PORT = process.env.PORT || 5000
const server = http.createServer(app, cors_allowed_origins='*');
const io = socketio(server, {transports: ['websocket', 'polling', 'flashsocket']});
const usersRouter = require('./routers/users');
const roomRouter = require('./routers/roomrouter')
const User = require('./models/User');
const Room = require('./models/Room');
// Init env file
dotenv.config();


// DB Connection
mongoose.connect(
  process.env.DB_URL, 
  {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log('Connected to DB')
  })
  
  app.use(cors({credentials: true, origin: 'http://localhost:8080'}))
  //app.options('http://localhost:3000', cors());
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  
  app.use('/users', usersRouter);
  app.use('/', roomRouter);
  
  
  //Run when client connects
  io.on('connection', socket => {
    


    console.log('Connected!')
    let foundUser = null;

    
    // //Welcome current user
    // socket.emit('message', 'Welcome');
    
    // //Broadcast when user connects
    // socket.broadcast.emit('message', 'A user has connected ')
    
    socket.on('join',async (data, callback) => {
      console.log('joining....')
      if(!data.user) {
        return
      }
      try{
        foundUser = await User.findById(data.user._id)
        foundRoom = await Room.findOne({roomName: data.room})
        foundRoom.users.push(foundUser)
        await foundRoom.save()
        socket.join(data.room)
        console.log('Joined', data)
        console.log(io.sockets.adapter.rooms)
        socket.emit('joindone', {room: foundRoom})
      } catch(error) {
        console.log(error)
      }
    });

    socket.on('message', async (data) => {
      
      if(!foundUser) {
        return
      }
      const newMessageObj = {
        message: data.message,
        // user: foundUser
      }
      //console.log(data)
      try {
      const newMessage = await Message.create(newMessageObj)
      foundUser.messages.push(newMessage)
      await foundUser.save()
      socket.emit('messageSaved', {message: newMessage, user: foundUser})

      } catch(error) {
        console.log(error)
      }

    })
    
    //Runs when client disconnects
    socket.on('disconnect',() => {
      io.emit('message', 'A user has left the chat');
    });
    //Listen for message
    socket.on('sendMessage', (message, callback) => {
      //const user = getUser() GET USER FROM DB
      console.log(socket.id, message)
      io.emit('message', {user: 'data here', message})
      callback();
    })
  });
  

  server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  
  
  
  







  

















