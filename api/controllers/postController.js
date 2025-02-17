const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary'); // Cloudinary configuration
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require('../models/User');

// Cloudinary Storage Configuration (for Cloudinary upload)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'posts', // Folder in Cloudinary where images will be stored
        allowedFormats: ['jpg', 'jpeg', 'png'],
    },
});
const upload = multer({ storage: storage }).single('image');
//Multer storage configuration
const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize Multer
const localUpload = multer({ storage: storage }).single('image');

exports.createPost = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) { // fallback
            console.log('Cloudinary upload failed, using local storage:', err);
            return localUpload(req, res, async(localErr) => {
                if(localErr) {
                    return res.status(500).json({message: "Error uploading image", error:localErr});
                }
                const { caption, auth0Id } = req.body;
                const image = req.file;

                if (!caption || !image || !auth0Id) {
                    return res.status(400).json({ message: 'Please provide caption, image, and auth0Id.' });
                }

                try {
                    const newPost = new Post({
                        caption,
                        imageUrl: `${process.env.REACT_APP_BACKEND_URL}/uploads/${image.filename}`,
                        auth0Id,
                    });

                    await newPost.save();
                    res.status(201).json({ message: 'Post created successfully', post: newPost });
                } catch (error) {
                    res.status(500).json({ message: 'Server error', error });
                }
            });
        }
        const { caption, auth0Id } = req.body;
        const image = req.file;

        if (!caption || !image || !auth0Id) {
            return res.status(400).json({ message: 'Please provide caption, image, and auth0Id.' });
        }

        try {
            const newPost = new Post({
                caption,
                imageUrl: image.path,
                auth0Id,
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

exports.likePost = async (req, res) => {
    try {
      const { auth0Id } = req.body; // Extract auth0Id sent from the frontend
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if the user has already liked the post
      const userHasLiked = post.likedBy.includes(auth0Id);
  
      if (userHasLiked) {
        // If the user has already liked, unlike it
        post.likes -= 1;
        post.likedBy = post.likedBy.filter((user) => user !== auth0Id); // Remove the user's ID from likedBy
      } else {
        // If the user hasn't liked, like it
        post.likes += 1;
        post.likedBy.push(auth0Id); // Add the user's ID to likedBy
      }
  
      // Save the updated post
      await post.save();
  
      // Return the updated post as a response
      res.status(200).json(post);
    } catch (error) {
      console.error('Error liking the post:', error);
      res.status(500).json({ message: 'Error liking the post', error });
    }
};