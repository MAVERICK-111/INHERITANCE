const { sendAMAMessage } = require('../controllers/AMAMessageController');

exports.setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinThread', (threadId) => {
      socket.join(threadId);
    });

    socket.on('sendMessage', async (data) => {
      await sendAMAMessage(data, socket);
      io.to(data.threadId).emit('message', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};