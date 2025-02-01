const mongoose = require('mongoose');

const HobbyMessageSchema = new mongoose.Schema({
  Hobbythread: { type: mongoose.Schema.Types.ObjectId, ref: 'HobbyThread', required: true },
  sender: { type: String, required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HobbyMessage', HobbyMessageSchema);