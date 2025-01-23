const express = require('express');
const { getHobbyMessages, saveHobbyMessage } = require('../controllers/HobbyMessageController');

const router = express.Router();

// Route to get previous messages for a hobby room
router.post('/hobbyChat', saveHobbyMessage);
router.get('/hobbyChat/:hobbyName', getHobbyMessages);

module.exports = router;