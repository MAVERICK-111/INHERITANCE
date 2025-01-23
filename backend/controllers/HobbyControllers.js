const Hobby = require('../models/HobbyModel');
const { validationResult } = require('express-validator');

// Create a new hobby
exports.createHobby = async (req, res) => {
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

// Get all hobbies
exports.getHobbies = async (req, res) => {
  try {
    const hobbies = await Hobby.find();
    res.status(200).json({ success: true, hobbies });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch hobbies' });
  }
};