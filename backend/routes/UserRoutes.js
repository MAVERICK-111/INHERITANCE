const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get user profile
router.get("/:auth0Id", async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.params.auth0Id });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile
router.put("/:auth0Id", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { auth0Id: req.params.auth0Id },
      req.body,
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;