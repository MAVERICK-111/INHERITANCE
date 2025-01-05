const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  creator: { type: String, required: true },
  participants: [{ type: String }],
  messages: [messageSchema],
});

module.exports = mongoose.model('Chat', chatSchema);
