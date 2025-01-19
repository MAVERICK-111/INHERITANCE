const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const { createHobby, getHobbies, joinChat, addMessage } = require('../controllers/hobbyController');

// Create a new hobby
router.post(
  '/create',
  [check('name').notEmpty().withMessage('Hobby name is required')],
  createHobby
);

// Fetch hobbies
router.get('/hobbies', getHobbies);

// Join a public chat
router.post(
  '/join',
  [
    check('chatName').notEmpty().withMessage('Chat name is required'),
    check('username').notEmpty().withMessage('Username is required')
  ],
  joinChat
);

// Add a message to a chat
router.post(
  '/message',
  [
    check('chatName').notEmpty().withMessage('Chat name is required'),
    check('user').notEmpty().withMessage('User is required'),
    check('content').notEmpty().withMessage('Message content is required')
  ],
  addMessage
);

module.exports = router;