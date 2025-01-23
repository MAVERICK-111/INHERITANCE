const { saveAMAMessage } = require('../controllers/AMAMessageController');
const { saveHobbyMessage } = require('../controllers/HobbyMessageController');

exports.setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // AMA 
        socket.on('joinAMARoom', (room) => {
            socket.join(room);
        });

        socket.on('sendAMAMessage', async (data) => {
            try {
                const newMessage = await saveAMAMessage(data);
                io.to(data.room).emit('receiveAMAMessage', newMessage);
            } catch (error) {
                socket.emit('error', { message: 'Failed to send AMA message' });
            }
        });

        // Hobby
        socket.on('joinHobbyRoom', (room) => {
            socket.join(room);
        });

        socket.on('sendHobbyMessage', async (data) => {
            try {
                const newMessage = await saveHobbyMessage(data);
                // Emit to the room to send the new message to all users in the room
                io.to(data.room).emit('receiveHobbyMessage', newMessage);
            } catch (error) {
                socket.emit('error', { message: 'Failed to send hobby message' });
            }
        });

        // Disconnect logic
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
