const express = require('express');
const HobbyMessageController = require('../controllers/HobbyMessageController');

const router = express.Router();

router.post('/sendHobbyMessage', HobbyMessageController.sendHobbyMessage);
router.get('/getHobbyMessages/:HobbythreadId', HobbyMessageController.getHobbyMessages)
module.exports = router;