const { saveAMAMessage } = require('../controllers/AMAMessageController');
const { saveHobbyMessage } = require('../controllers/HobbyMessageController');

exports.setupSocket = (io) => {
    let users = {};
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
                io.to(data.room).emit('receiveHobbyMessage', newMessage);
            } catch (error) {
                socket.emit('error', { message: 'Failed to send hobby message' });
            }
        });
        
        // Chat
        socket.on('join', (auth0Id) => {
            users[auth0Id] = socket.id;
            console.log(`User ${auth0Id} joined with socket ID: ${socket.id}`);
        });

        socket.on('sendMessage', ({ senderId, receiverId, message }) => {
            const receiverSocket = users[receiverId];
            if (receiverSocket) {
                io.to(receiverSocket).emit('receiveMessage', { senderId, message });
            }
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
