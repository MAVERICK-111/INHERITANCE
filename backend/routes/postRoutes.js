const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controllers/postController');

router.post('/', createPost);  // To create a new post
router.get('/', getPosts);  // To get all posts

module.exports = router;
