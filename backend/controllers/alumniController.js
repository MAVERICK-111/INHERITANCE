const cloudinary = require('../config/cloudinary'); // Cloudinary config
const Alumni = require('../models/Alumni');
const fs = require('fs'); // For file system operations

exports.createAlumni = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo uploaded' });
    }

    const { info } = req.body;
    const filePath = req.file.path; // Path of the uploaded file

    // Upload image to Cloudinary
    cloudinary.uploader.upload(filePath, { folder: 'alumni_photos' })
      .then(async (result) => {
        const newAlumni = new Alumni({
          photo: result.secure_url, // Save Cloudinary URL
          info,
        });

        await newAlumni.save();
        
        // Delete the local file after uploading to Cloudinary
        fs.unlinkSync(filePath);

        res.status(200).json({
          success: true,
          message: 'Alumni data saved successfully!',
          photo: result.secure_url, // Send Cloudinary URL in response
        });
      })
      .catch(err => {
        console.error('Cloudinary upload error:', err);
        res.status(500).json({ success: false, message: 'Error uploading photo to Cloudinary', error: err.message });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error saving alumni data', error: err.message });
  }
};

exports.getAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find();
    res.status(200).json({ success: true, alumni });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch alumni data' });
  }
};
