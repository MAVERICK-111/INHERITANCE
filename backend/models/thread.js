const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: { type: String, required: true },
  messages: [{type: mongoose.Schema.Types.ObjectId, red: 'Message'}],
});

module.exports = mongoose.model('Thread', threadSchema);