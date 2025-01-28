const mongoose = require('mongoose');

const AMAMessageSchema = new mongoose.Schema({
  AMAthread: { type: mongoose.Schema.Types.ObjectId, ref: 'AMAThread', required: true },
  sender: { type: String, required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AMAMessage', AMAMessageSchema);