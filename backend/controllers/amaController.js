const Question = require('../models/question');

// Controller to ask a question
const askQuestion = async (req, res) => {
    const { question } = req.body;
    const userId = req.user.id; // Assume user is authenticated and their ID is in req.user
    try {
        const newQuestion = await Question.create({ question, askedBy: userId });
        res.status(201).json({ message: 'Question posted successfully', question: newQuestion });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to answer a question
const answerQuestion = async (req, res) => {
    const { id } = req.params;
    const { answer } = req.body;
    const seniorId = req.user.id; // Assume user is authenticated
    try {
        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        question.answer = answer;
        question.answeredBy = seniorId;
        question.isAnswered = true;
        await question.save();
        res.json({ message: 'Answer posted successfully', question });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to get all questions
const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find().populate('askedBy answeredBy', 'name email');
        res.json(questions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { askQuestion, answerQuestion, getQuestions };
