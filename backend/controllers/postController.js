const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');

//Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize Multer
const upload = multer({ storage: storage }).single('image');
exports.createPost = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading image', error: err });
        }
        const { caption } = req.body;
        const image = req.file;
        if (!caption || !image) {
            return res.status(400).json({ message: 'Please provide both caption and image.' });
        }
        try {
            const newPost = new Post({
                caption,
                imageUrl: `http://localhost:5000/uploads/${image.filename}`,
            });
            await newPost.save();
            res.status(201).json({ message: 'Post created successfully', post: newPost });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    });
};

// Get all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
