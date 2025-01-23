const express = require('express');
const AMAController = require('../controllers/AMAThreadController');

const router = express.Router();

router.post('/createAMAThread', AMAController.createAMAThread);
router.get('/getAMAThreads', AMAController.getAMAThreads);

module.exports = router;