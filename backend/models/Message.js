const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  room: String,
  text: String,
  sender: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
