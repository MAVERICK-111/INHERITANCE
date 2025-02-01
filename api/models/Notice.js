const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    image: { type: String }, // Optional field for an image URL
});

module.exports = mongoose.model('Notice', noticeSchema);
