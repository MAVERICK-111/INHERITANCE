const mongoose = require('mongoose');

const AlumniSchema = new mongoose.Schema({
  photo: { type: String, required: true },
  info: { type: String, required: true },
});

module.exports = mongoose.model('Alumni', AlumniSchema);