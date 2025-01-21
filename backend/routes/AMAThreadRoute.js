const express = require('express');
const router = express.Router();
const { createAMAThread, getAMAThreads } = require('../controllers/AMAThreadController');

router.post('/createAMAThread', createAMAThread);
router.get('/getAMAThreads', getAMAThreads);

module.exports = router;