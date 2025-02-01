const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const upload = require('../utils/upload');

router.post('/', upload.single('photo'), alumniController.createAlumni);
router.get('/', alumniController.getAlumni);

module.exports = router;