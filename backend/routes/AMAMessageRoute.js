const express = require('express');
const AMAMessageController = require('../controllers/AMAMessageController');

const router = express.Router();

router.post('/sendAMAMessage', AMAMessageController.sendAMAMessage);
router.get('/getAmaMessages/:AMAthreadId', AMAMessageController.getAMAMessages)
module.exports = router;