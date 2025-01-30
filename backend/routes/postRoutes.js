const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost } = require('../controllers/postController');

router.post('/', createPost);
router.get('/', getPosts);
router.patch('/:id/like', likePost);

module.exports = router;
