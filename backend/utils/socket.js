const { sendAMAMessage } = require('../controllers/AMAMessageController');

exports.setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    //AMA
    socket.on('joinAMAThread', (AMAthreadId) => {
      socket.join(AMAthreadId);
    });

    socket.on('sendAMAMessage', async (data) => {
      io.to(data.AMAthreadId).emit('AMAmessage', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    //HOBBY
    socket.on('joinHobbyRoom', (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on('sendHobbyMessage', async (data) => {
      try {
        const newMessage = await saveHobbyMessage(data);
        io.to(data.room).emit('receiveHobbyMessage', newMessage); // Broadcast to room
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};