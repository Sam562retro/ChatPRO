const express = require('express');
const app = express()
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = new socketIo.Server(server);
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers, giveAllRooms, createRoom} = require('./utils/users');


app.use(express.static(path.resolve(__dirname, './public')));
const botName = 'Cody';

io.on('connection', socket => {
    console.log('a user connected');
    socket.on('joinRoom', ({
        username, room
    }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
    //    welcome current user
        socket.emit('messageFromServer', formatMessage(botName, 'Welcome To ChatPRO'));
    //    broadcast when a user enters
        socket.broadcast
            .to(user.room)
            .emit('messageFromServer', formatMessage(botName, String(`${user.userName} has joined the room`)));

    //    send users and room info
        io
            .to(user.room)
            .emit('roomUser', {
                roomNameSent: String(user.room),
                users : getRoomUsers(user.room)
            })
    })

//    listen to chat messages
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('messageFromServer', formatMessage(user.userName, msg))
    })

    //message to notify user disconnection
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit('messageFromServer', formatMessage(botName, `${user.userName} has left the room`));
            io.to(user.room).emit('roomUser', {roomNameSent : String(user.room), users : getRoomUsers(user.room)});
        }
    })
})



app.get('/', (req, res) => {
    res.sendFile('/index.html');
});


server.listen(4000, () => {
    console.log('connecting to http://localhost:4000');
});