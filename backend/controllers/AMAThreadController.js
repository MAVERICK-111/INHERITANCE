const AMAThread = require('../models/AMAThread');

exports.createAMAThread = async (req, res) => {
  const { title, creator } = req.body;

  try {
    const newThread = new AMAThread({ title, creator });
    await newThread.save();
    res.status(201).json({ success: true, AMAthread: newThread });
  } catch (err) {
    res.status(500).json({ success: false, AMAmessages: 'Failed to create AMA thread' });
  }
};

exports.getAMAThreads = async (req, res) => {
  try {
    const AMAthreads = await AMAThread.find().populate('messages');
    res.status(200).json({ success: true, AMAthreads });
  } catch (err) {
    res.status(500).json({ success: false, AMAmessages: 'Failed to fetch AMA threads' });
  }
};