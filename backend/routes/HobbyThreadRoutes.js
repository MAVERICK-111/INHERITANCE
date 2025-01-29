const express = require('express');
const HobbyController = require('../controllers/HobbyThreadControllers');

const router = express.Router();

router.post('/createHobbyThread', HobbyController.createHobbyThread);
router.get('/getHobbyThreads', HobbyController.getHobbyThreads);
router.delete('/deleteHobbyThread/:HobbythreadId', HobbyController.deleteHobbyThread);

module.exports = router;