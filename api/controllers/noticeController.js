const Notice = require('../models/Notice');

// Get all notices
const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1 });
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notices' });
    }
};

// Add a new notice
const addNotice = async (req, res) => {
    const { title, description, image } = req.body;
    try {
        const newNotice = new Notice({ title, description, image });
        await newNotice.save();
        res.status(201).json(newNotice);
    } catch (error) {
        res.status(500).json({ message: 'Error creating notice' });
    }
};

module.exports = { getNotices, addNotice };
