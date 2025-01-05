const express = require('express');
const { askQuestion, answerQuestion, getQuestions } = require('../controllers/amaController');
const router = express.Router();

// Route to ask a question
router.post('/ask', askQuestion);

// Route to answer a question
router.post('/answer/:id', answerQuestion);

// Route to get all questions (answered or not)
router.get('/', getQuestions);

module.exports = router;
