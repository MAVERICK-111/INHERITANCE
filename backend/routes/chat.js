const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Send a new message
router.post("/", async (req, res) => {
  const { user, message } = req.body;
  try {
    const newMessage = new Message({ user, message });
    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;