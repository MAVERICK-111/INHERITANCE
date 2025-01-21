const mongoose = require('mongoose');

const AMAThreadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('AMAThread', AMAThreadSchema);