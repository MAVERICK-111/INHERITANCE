const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');

// Set up Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define the directory to store the uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename based on timestamp
    }
});

// Initialize Multer
const upload = multer({ storage: storage }).single('image');  // Single image upload with the field name 'image'

// Create a new post with image and caption
exports.createPost = async (req, res) => {
    // Handle file upload using Multer
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading image', error: err });
        }

        // Capture caption and image details
        const { caption } = req.body;
        const image = req.file;

        // Ensure both caption and image are provided
        if (!caption || !image) {
            return res.status(400).json({ message: 'Please provide both caption and image.' });
        }

        try {
            // Create a new post with caption and image URL
            const newPost = new Post({
                caption,
                imageUrl: `/uploads/${image.filename}`, // URL path for accessing the image
            });

            // Save the post to the database
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
        const posts = await Post.find().sort({ createdAt: -1 }); // Sort posts by creation date
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
