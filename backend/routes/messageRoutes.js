const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// Get messages for a specific thread
router.get('/:threadId', async (req, res) => {
  const { threadId } = req.params;
  try {
    const messages = await Message.find({ room: threadId }).sort({ timestamp: 1 });
    res.status(200).send({ success: true, messages });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to fetch messages' });
  }
});

module.exports = router;
