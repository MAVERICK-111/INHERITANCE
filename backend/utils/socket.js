const { sendAMAMessage } = require('../controllers/AMAMessageController');

exports.setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinAMAThread', (AMAthreadId) => {
      socket.join(AMAthreadId);
    });

    socket.on('sendAMAMessage', async (data) => {
      io.to(data.AMAthreadId).emit('AMAmessage', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};