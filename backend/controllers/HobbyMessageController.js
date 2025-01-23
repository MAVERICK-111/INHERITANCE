const HobbyMessage = require('../models/HobbyMessageModel');
let io;

// Reusable setSocket function to set the socket instance
const setSocket = (socketIo) => {
  io = socketIo;
};

const getHobbyMessages = async (req, res) => {
    const { hobbyName } = req.params;
    try {
        const messages = await HobbyMessage.find({ room: hobbyName }).sort({ timestamp: 1 });
        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
};

const saveHobbyMessage = async (data) => {
    const { room, sender, text, timestamp } = data;
    try {
        const newMessage = new HobbyMessage({ room, sender, text, timestamp });
        await newMessage.save();

        if (io) {
            io.to(room).emit('hobbyMessage', { ...newMessage._doc }); // Emit the new message to the specific room
        }
        return newMessage;
    } catch (error) {
        console.error('Failed to save message:', error);
        throw error;
    }
};

module.exports = { setSocket, getHobbyMessages, saveHobbyMessage };