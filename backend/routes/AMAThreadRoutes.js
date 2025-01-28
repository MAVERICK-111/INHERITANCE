const express = require('express');
const AMAController = require('../controllers/AMAThreadController');

const router = express.Router();

router.post('/createAMAThread', AMAController.createAMAThread);
router.get('/getAMAThreads', AMAController.getAMAThreads);
router.delete('/deleteAMAThread/:AMAthreadId', AMAController.deleteAMAThread);  // Delete route for AMA thread

module.exports = router;