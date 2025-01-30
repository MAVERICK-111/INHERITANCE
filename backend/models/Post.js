const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption: { type: String, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String}],
});

module.exports = mongoose.model('Post', postSchema);
