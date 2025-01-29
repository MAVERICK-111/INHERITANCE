const mongoose = require('mongoose');

const HobbyThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: { type: String, required: true },
  creatorName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HobbyMessage' }],
});

module.exports = mongoose.model('HobbyThread', HobbyThreadSchema);