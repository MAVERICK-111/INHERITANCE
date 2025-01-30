const Alumni = require('../models/Alumni');

exports.createAlumni = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo uploaded' });
    }

    const { info } = req.body;
    const newAlumni = new Alumni({
      photo: `http://localhost:5000/uploads/${req.file.filename}`,
      info,
    });   

    await newAlumni.save();
    res.status(200).json({
      success: true,
      message: 'Alumni data saved successfully!',
      photo: `http://localhost:5000/uploads/${req.file.filename}`,
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