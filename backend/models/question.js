const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    askedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    answer: { type: String, default: null },
    isAnswered: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
