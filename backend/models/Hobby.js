const mongoose = require('mongoose');

// Define the Hobby schema
const hobbySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Create the Hobby model
const Hobby = mongoose.model('Hobby', hobbySchema);

module.exports = Hobby;

