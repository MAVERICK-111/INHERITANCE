const express = require('express');
const AMAMessageController = require('../controllers/AMAMessageController');

const router = express.Router();

router.post('/sendAMAMessage', AMAMessageController.sendAMAMessage);
router.get('/getAmaMessage', AMAMessageController.getAMAMessages)
module.exports = router;