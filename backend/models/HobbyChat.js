const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, //Chat name is required
    unique: true,   //Ensure each chat name is unique
  },
  participants: {
    type: [String],  //An array of usernames of participants
    default: [],
  },
  messages: [
    {
      user: { type: String, required: true },  // User who sent the message
      content: { type: String, required: true }, // Message content
      timestamp: { type: Date, default: Date.now },  // Timestamp of the message
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('HobbyChat', chatSchema);
