const AMAThread = require('../models/AMAThread');

exports.createAMAThread = async (req, res) => {
  const { title, creator, creatorName } = req.body;

  try {
    const newThread = new AMAThread({ title, creator, creatorName });
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

exports.deleteAMAThread = async (req, res) => {
  const { AMAthreadId } = req.params;
  const { userSub } = req.body;  // User's sub from the request body

  try {
    const thread = await AMAThread.findById(AMAthreadId);

    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }

    // Ensure the user is the creator of the thread
    if (thread.creator !== userSub) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this thread' });
    }

    await AMAThread.findByIdAndDelete(AMAthreadId);
    res.status(200).json({ success: true, message: 'Thread deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete thread', error: err });
  }
};