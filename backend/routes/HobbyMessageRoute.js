const express = require('express');
const { getHobbyMessages } = require('../controllers/HobbyMessageController');

const router = express.Router();

// Route to get previous messages for a hobby room
router.get('/hobbyChat/:hobbyName', getHobbyMessages);

module.exports = router;