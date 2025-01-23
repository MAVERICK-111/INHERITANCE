const mongoose = require('mongoose');

const HobbyMessageSchema = new mongoose.Schema({
    room: { type: String, required: true },
    sender: { type: String, required: true },
    text: { type: String, required: true },
});

module.exports = mongoose.model('HobbyMessage', HobbyMessageSchema);
