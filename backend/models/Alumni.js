const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  photo: String,
  info: String,
});

const Alumni = mongoose.model('Alumni', alumniSchema);

module.exports = Alumni;
