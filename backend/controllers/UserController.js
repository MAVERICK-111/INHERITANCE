const User = require("../models/User");

// Get User Profile or create a dummy one if it doesn't exist
exports.getUser = async (req, res) => {
  try {
    const userId = decodeURIComponent(req.params.auth0Id);
    console.log("Received auth0Id:", userId);

    if (!userId || userId === "null" || userId === "undefined") {
      console.error("Error: Invalid auth0Id received:", userId);
      return res.status(400).json({ error: "Invalid auth0Id" });
    }

    let user = await User.findOne({ auth0Id: userId });

    if (!user) {
      console.log("User not found. Creating a new one...");
      user = new User({
        auth0Id: userId,
        email: `abc123@example.com`,
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
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update User Profile
exports.updateUser = async (req, res) => {
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
};

// Get all users except current user
exports.getAllUsers = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    const users = await User.find({ auth0Id: { $ne: auth0Id } }); // Exclude current user
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUsernameByAuth0Id = async (req, res) => {
  const { auth0Id } = req.params;  // Extract auth0Id from request parameters
  try {
      const user = await User.findOne({ auth0Id });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ username: user.username });
  } catch (error) {
      console.error('Error fetching username:', error);
      res.status(500).json({ message: 'Server error', error });
  }
};