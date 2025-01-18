// AMAMessage.js
const mongoose = require('mongoose');

// Define the message schema
const messageSchema = new mongoose.Schema(
  {
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread', // reference to the Thread model
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create the Message model
const AMAMessage = mongoose.model('AMAMessage', messageSchema);

module.exports = AMAMessage;
