const AMAMessage = require('../models/AMAMessage');
const AMAThread = require('../models/AMAThread');
const setSocket = (socketIo) => {
  op = socketIo;
};
const sendAMAMessage = async (req, res) => {
  const { AMAthreadId, sender, senderName, text } = req.body;

  try {
    const newMessage = new AMAMessage({ AMAthread: AMAthreadId, sender,senderName, text });
    await newMessage.save();
    if (io) {
      io.to(AMAthreadId).emit('AMAmessage', { ...newMessage._doc });
    }

    await AMAThread.findByIdAndUpdate(AMAthreadId, {
      $push: { messages: newMessage._id },
    });

    res.status(200).json({ success: true, message: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send AMA message' });
  }
};
const getAMAMessages = async (req, res) => {
  try {
    const messages = await AMAMessage.find({ AMAthread  : req.params.AMAthreadId });
    res.status(200).json({ AMAmessages: messages });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching AMA messages', error: err });
  }
};

module.exports = { sendAMAMessage, getAMAMessages, setSocket };