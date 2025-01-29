const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Get User Profile or create a dummy one if it doesn't exist
router.get("/getUser/:auth0Id", async (req, res) => {
  try {
    const userId = decodeURIComponent(req.params.auth0Id); // Decode the auth0Id
   

    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Check if the user already exists
    const user = await User.findOne({ auth0Id: userId });

    if (!user) {
      
      
      const dummyEmail = `abc123@example.com`; 
      const dummyUser = new User({
        auth0Id: userId,  
        email: dummyEmail, 
        username: "enter your username",
        age: 25,
        profilePicture: "https://picsum.photos/seed/picsum/200/300",
      });

      
      if (dummyUser.auth0Id) {
        await dummyUser.save();
        
        return res.json(dummyUser);
      } else {
        return res.status(400).json({ error: "Failed to create user: invalid auth0Id" });
      }
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
