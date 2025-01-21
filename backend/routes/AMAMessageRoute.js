const express = require('express');
const router = express.Router();
const { sendAMAMessage, getAMAMessages } = require('../controllers/AMAMessageController');

router.post('/sendAMAmessage', sendAMAMessage);
router.get('/:AMAthreadId/messages', getAMAMessages);

module.exports = router;