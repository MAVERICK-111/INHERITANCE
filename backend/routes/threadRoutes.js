const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController');

// Route for creating a new thread
router.post('/createThread', threadController.createThread);

// Route for getting all threads
router.get('/', threadController.getThreads);

// Route for posting a message in a thread
router.post('/sendMessage', threadController.sendMessage);

module.exports = router;