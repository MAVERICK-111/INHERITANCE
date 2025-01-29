const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  username: { type: String },
  age: { type: Number },
  profilePicture: { type: String },
});

module.exports = mongoose.model("User", UserSchema);