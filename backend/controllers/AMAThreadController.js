const AMAThread = require('../models/AMAThread');

// Create a new AMA thread
// const createAMAThread = async (req, res) => {
//   try {
//     const { title, creator } = req.body;
//     const newThread = new AMAThread({ title, creator });
//     await newThread.save();
//     console.log('error creating thread testing');
//     res.status(201).json({ AMAthread: newThread });
//   } catch (err) {
//     res.status(400).json({ message: 'Error creating AMA thread', error: err });
//   }
// };
const createAMAThread = async (req, res) => {
  console.log("rtyuity")
  try {
    const { title, creator } = req.body;
    if (!title || !creator) {
      return res.status(400).json({ message: 'Title and creator are required' });
    }
    const newThread = new AMAThread({ title, creator });
    console.log(newThread)
    await newThread.save();
    res.status(201).json({ AMAthread: newThread });
  } catch (err) {
    res.status(400).json({ message: 'Error creating AMA thread', error: err });
  }
};

// Get all AMA threads
const getAMAThreads = async (req, res) => {
  try {
    const threads = await AMAThread.find();
    res.status(200).json({ AMAthreads: threads });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching AMA threads', error: err });
  }
};

module.exports = { createAMAThread, getAMAThreads };