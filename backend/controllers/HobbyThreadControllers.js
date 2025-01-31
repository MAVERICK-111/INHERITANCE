const HobbyThread = require('../models/HobbyThread');

exports.createHobbyThread = async (req, res) => {
  const { title, creator, creatorName } = req.body;
  try {
    const newThread = new HobbyThread({ title, creator, creatorName });
    await newThread.save();
    res.status(201).json({ success: true, Hobbythread: newThread });
  } catch (err) {
    res.status(500).json({ success: false, Hobbymessages: 'Failed to create Hobby thread' });
  }
};

exports.getHobbyThreads = async (req, res) => {
  try {
    const Hobbythreads = await HobbyThread.find().populate('messages').sort({ createdAt: -1});
    res.status(200).json({ success: true, Hobbythreads });
  } catch (err) {
    res.status(500).json({ success: false, Hobbymessages: 'Failed to fetch Hobby threads' });
  }
};