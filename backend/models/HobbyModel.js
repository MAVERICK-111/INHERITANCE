const mongoose = require('mongoose');

// Hobby Schema
const HobbySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

module.exports = mongoose.model('Hobby', HobbySchema);