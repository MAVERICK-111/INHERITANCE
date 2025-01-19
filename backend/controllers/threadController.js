const Thread = require('../models/Thread');
const Message = require('../models/MyMessage');

exports.createThread = async (req, res) => {
  const { title, creator } = req.body;

  if (!title || !creator) {
    return res.status(400).json({ success: false, message: 'Title and creator are required' });
  }

  try {
    const newThread = new Thread({
      title,
      creator,
      messages: [],  // Start with an empty message array
    });

    await newThread.save();
    res.status(201).json({ success: true, thread: newThread });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create thread' });
  }
};

exports.getThreads = async (req, res) => {
  try {
    const threads = await Thread.find();  // Fetch all threads from the database
    res.status(200).json({ success: true, threads });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch threads' });
  }
};

exports.sendMessage = async (req, res) => {
  const { threadId, sender, text } = req.body;

  try {
    const newMessage = new Message({
      thread: threadId,  // Reference to the thread
      sender,
      text,
      timestamp: new Date(),
    });

    await newMessage.save();

    // Optionally, update the thread with the new message
    await Thread.findByIdAndUpdate(threadId, {
      $push: { messages: newMessage._id },
    });

    // Respond with the new message
    res.status(200).json({ success: true, message: newMessage });
  } catch (err) {
    console.error('Error posting message:', err);
    res.status(500).json({ success: false, message: 'Failed to post message' });
  }
};
