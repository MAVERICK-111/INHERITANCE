const express = require('express');
const { getHobbyMessages } = require('../controllers/HobbyMessageController');

const router = express.Router();

router.get('/hobbyChat/:hobbyName', getHobbyMessages);

module.exports = router;
