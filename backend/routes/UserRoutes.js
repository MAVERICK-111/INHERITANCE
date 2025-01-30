const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Get User Profile or create a dummy one if it doesn't exist
router.get("/getUser/:auth0Id", async (req, res) => {
  try {
    const userId = decodeURIComponent(req.params.auth0Id); // Decode the auth0Id
    console.log("Received auth0Id:", userId); // Debugging

    if (!userId || userId === "null" || userId === "undefined") {
      console.error("Error: Invalid auth0Id received:", userId);
      return res.status(400).json({ error: "Invalid auth0Id" });
    }

    // Check if the user already exists
    let user = await User.findOne({ auth0Id: userId });

    if (!user) {
      console.log("User not found. Creating a new one...");

      const dummyEmail = `abc123@example.com`; 
      user = new User({
        auth0Id: userId,  
        email: dummyEmail, 
        username: "enter your username",
        age: 25,
        profilePicture: "https://picsum.photos/seed/picsum/200/300",
      });

      await user.save();
      console.log("User created successfully:", user);
    } else {
      console.log("User found:", user);
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching or creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// Update User Profile
router.put("/updateUser/:auth0Id", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { auth0Id: req.params.auth0Id },
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

module.exports = router;
