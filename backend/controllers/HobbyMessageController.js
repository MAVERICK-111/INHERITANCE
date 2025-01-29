const HobbyMessage = require('../models/HobbyMessage');
const HobbyThread = require('../models/HobbyThread');
const setSocket = (socketIo) => {
  op = socketIo;
};
const sendHobbyMessage = async (req, res) => {
  const { HobbythreadId, sender, senderName, text } = req.body;

  try {
    const newMessage = new HobbyMessage({ Hobbythread: HobbythreadId, sender,senderName, text });
    await newMessage.save();
    if (io) {
      io.to(HobbythreadId).emit('Hobbymessage', { ...newMessage._doc });
    }

    await HobbyThread.findByIdAndUpdate(HobbythreadId, {
      $push: { messages: newMessage._id },
    });

    res.status(200).json({ success: true, message: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send Hobby message' });
  }
};
const getHobbyMessages = async (req, res) => {
  try {
    const messages = await HobbyMessage.find({ Hobbythread  : req.params.HobbythreadId });
    res.status(200).json({ Hobbymessages: messages });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching Hobby messages', error: err });
  }
};

module.exports = { sendHobbyMessage, getHobbyMessages, setSocket };