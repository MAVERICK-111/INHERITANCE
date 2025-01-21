const AMAMessage = require('../models/AMAMessage');

// Create a new AMA message
const sendAMAMessage = async (req, res) => {
  const { threadId, sender, text } = req.body;

  try {
    const newMessage = new AMAMessage({ thread: threadId, sender, text });
    await newMessage.save();
    io.to(AMAthreadId).emit('AMAmessage', {
      AMAthreadId,
      sender,
      text,
    });
    await AMAThread.findByIdAndUpdate(threadId, {
      $push: { messages: newMessage._id },
    });

    res.status(200).json({ success: true, message: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send AMA message' });
  }
};

// Get all AMA messages for a specific thread
const getAMAMessages = async (req, res) => {
  try {
    const messages = await AMAMessage.find({ AMAthreadId: req.params.AMAthreadId });
    res.status(200).json({ AMAmessages: messages });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching AMA messages', error: err });
  }
};

module.exports = { sendAMAMessage, getAMAMessages };