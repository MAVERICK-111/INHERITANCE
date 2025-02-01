const express = require('express');
const { getNotices, addNotice } = require('../controllers/noticeController');

const router = express.Router();

router.get('/', getNotices);
router.post('/', addNotice);

module.exports = router;
