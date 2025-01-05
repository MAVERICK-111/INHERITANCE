const express = require('express');
const Chat = require('../models/chat');

const router = express.Router();

// Create a new public chat
router.post('/create', async (req, res) => {
  const { name, description, creator } = req.body;

  try {
    const newChat = new Chat({ name, description, creator, participants: [creator] });
    await newChat.save();
    res.status(201).json({ message: 'Chat created successfully', chat: newChat });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all public chats
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find();
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join a public chat
router.post('/join', async (req, res) => {
  const { chatName, username } = req.body;

  try {
    const chat = await Chat.findOne({ name: chatName });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    if (!chat.participants.includes(username)) {
      chat.participants.push(username);
      await chat.save();
    }

    res.status(200).json({ message: 'Joined chat', chat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a message to a chat
router.post('/message', async (req, res) => {
  const { chatName, user, content } = req.body;

  try {
    const chat = await Chat.findOne({ name: chatName });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    chat.messages.push({ user, content });
    await chat.save();

    res.status(200).json({ message: 'Message sent', chat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
