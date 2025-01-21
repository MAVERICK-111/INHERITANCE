const socketIO = require('socket.io');
const AMAmessages = require('../models/AMAmessage');

let io;

const initSocket = (server) => {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('User connected');

    // Join an AMA thread
    socket.on('joinAMAthread', async (AMAthreadId) => {
      console.log(`User joined AMA thread: ${AMAthreadId}`);
      socket.join(AMAthreadId);
    });

    // Listen for new AMA message and broadcast to clients
    socket.on('sendAMAmessage', async (data) => {
      const { AMAthreadId, sender, text } = data;

      try {
        const newMessage = new AMAmessages({ AMAthreadId, sender, text });
        await newMessage.save();
        io.to(AMAthreadId).emit('AMAmessage', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

module.exports = { initSocket };
