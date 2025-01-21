const AMAMessage = require('../models/AMAMessage');

// Create a new AMA message
const sendAMAMessage = async (req, res) => {
  try {
    const { AMAthreadId, sender, text } = req.body;
    const newMessage = new AMAMessage({ AMAthreadId, sender, text });
    await newMessage.save();
    res.status(201).json({ AMAmessage: newMessage });
  } catch (err) {
    res.status(400).json({ message: 'Error sending AMA message', error: err });
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