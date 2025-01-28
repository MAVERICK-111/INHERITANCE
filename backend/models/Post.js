const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption: { type: String, required: true },
    imageUrl: { type: String, required: true }, // URL to the uploaded image
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
