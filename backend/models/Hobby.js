const mongoose = require('mongoose');

const HobbySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model('Hobby', HobbySchema);