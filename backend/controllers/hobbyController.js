const Hobby = require('../models/hobby');
const HobbyChat = require('../models/HobbyChat');
const { validationResult } = require('express-validator');

// Controller to create a hobby
const createHobby = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;
    const newHobby = new Hobby({ name });
    await newHobby.save();
    res.status(201).json({ success: true, hobby: newHobby });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create hobby' });
  }
};

// Controller to fetch hobbies
const getHobbies = async (req, res) => {
  try {
    const hobbies = await Hobby.find();
    res.status(200).json({ success: true, hobbies });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch hobbies' });
  }
};

// Controller for joining a public chat
const joinChat = async (req, res) => {
  const { chatName, username } = req.body;

  try {
    const chat = await HobbyChat.findOne({ name: chatName });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    if (!chat.participants.includes(username)) {
      chat.participants.push(username);
      await chat.save();
    }

    res.status(200).json({ message: 'Joined chat successfully', chat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller for adding a message to a chat
const addMessage = async (req, res) => {
  const { chatName, user, content } = req.body;

  try {
    const chat = await HobbyChat.findOne({ name: chatName });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    chat.messages.push({ user, content });
    await chat.save();

    res.status(200).json({ message: 'Message sent successfully', chat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createHobby, getHobbies, joinChat, addMessage };
