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
    const Hobbythreads = await HobbyThread.find().populate('messages');
    res.status(200).json({ success: true, Hobbythreads });
  } catch (err) {
    res.status(500).json({ success: false, Hobbymessages: 'Failed to fetch Hobby threads' });
  }
};

exports.deleteHobbyThread = async (req, res) => {
  const { HobbythreadId } = req.params;
  const { userSub } = req.body;  // User's sub from the request body

  try {
    const thread = await HobbyThread.findById(HobbythreadId);

    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }

    // Ensure the user is the creator of the thread
    if (thread.creator !== userSub) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this thread' });
    }

    await HobbyThread.findByIdAndDelete(HobbythreadId);
    res.status(200).json({ success: true, message: 'Thread deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete thread', error: err });
  }
};