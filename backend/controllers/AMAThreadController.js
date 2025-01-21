const AMAThread = require('../models/AMAThread');

exports.createAMAThread = async (req, res) => {
  const { title, creator } = req.body;

  try {
    const newThread = new AMAThread({ title, creator });
    await newThread.save();
    res.status(201).json({ success: true, thread: newThread });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create AMA thread' });
  }
};

exports.getAMAThreads = async (req, res) => {
  try {
    const threads = await AMAThread.find().populate('messages');
    res.status(200).json({ success: true, threads });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch AMA threads' });
  }
};