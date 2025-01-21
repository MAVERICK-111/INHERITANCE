const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const upload = require('../utils/upload');

// Route for creating a new alumni entry
router.post('/', upload.single('photo'), alumniController.createAlumni);

// Route for getting all alumni
router.get('/', alumniController.getAlumni);

module.exports = router;