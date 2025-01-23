const HobbyMessage = require('../models/HobbyMessageModel');

// Fetch previous messages for a hobby room
exports.getHobbyMessages = async (req, res) => {
  const { hobbyName } = req.params;

  try {
    const messages = await HobbyMessage.find({ room: hobbyName }).sort({ timestamp: 1 });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

// Save a new hobby message
exports.saveHobbyMessage = async (data) => {
  const { room, sender, text, timestamp } = data;

  try {
    const newMessage = new HobbyMessage({ room, sender, text, timestamp });
    await newMessage.save();
    return newMessage;
  } catch (err) {
    console.error('Failed to save message:', err);
    throw err;
  }
};
