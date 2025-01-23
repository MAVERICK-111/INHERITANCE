const express = require('express');
const { check } = require('express-validator');
const { createHobby, getHobbies } = require('../controllers/HobbyControllers');

const router = express.Router();

// Route to create a new hobby
router.post(
  '/createHobby',
  [check('name').notEmpty().withMessage('Hobby name is required')],
  createHobby
);

// Route to fetch all hobbies
router.get('/hobbies', getHobbies);

module.exports = router;