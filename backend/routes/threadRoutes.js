const express = require('express');
const router = express.Router();
const Thread = require('../models/thread');

// Get all threads
router.get('/', async (req, res) => {
  try {
    const threads = await Thread.find();
    res.status(200).send({ success: true, threads });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to fetch threads' });
  }
});

// Create a new thread
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const newThread = new Thread({ name });
    await newThread.save();
    res.status(201).send({ success: true, thread: newThread });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to create thread' });
  }
});

module.exports = router;
