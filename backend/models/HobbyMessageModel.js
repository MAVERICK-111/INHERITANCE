const mongoose = require('mongoose');

// Hobby Message Schema
const HobbyMessageSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HobbyMessage', HobbyMessageSchema);