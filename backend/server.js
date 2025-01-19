const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const Hobby = require('./models/hobby');
const Message = require('./models/message');
const Thread = require('./models/thread');
const authRoutes = require('./routes/authRoutes');
const AMAMessage = require('./models/AMAMessage');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Alumni Schema
const alumniSchema = new mongoose.Schema({
  photo: { type: String, required: true },
  info: { type: String, required: true },
});

const Alumni = mongoose.model('Alumni', alumniSchema);

// Multer Storage and Validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isValid = allowedTypes.test(file.mimetype) && allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG files are allowed.'));
    }
  },
});

// Serve static files
app.use('/uploads', express.static(uploadDir));

// Routes for Hobbies
app.post(
  '/createHobby',
  [check('name').notEmpty().withMessage('Hobby name is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name } = req.body;
      const newHobby = new Hobby({ name });
      await newHobby.save();
      res.status(201).json({ success: true, hobby: newHobby });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to create hobby' });
    }
  }
);

app.get('/hobbies', async (req, res) => {
  try {
    const hobbies = await Hobby.find();
    res.status(200).json({ success: true, hobbies });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch hobbies' });
  }
});

// Alumni Routes
app.post('/alumni', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo uploaded' });
    }

    const { info } = req.body;
    const newAlumni = new Alumni({
      photo: req.file.path,
      info,
    });

    await newAlumni.save();
    res.status(200).json({
      success: true,
      message: 'Alumni data saved successfully!',
      photo: `http://localhost:5000/${req.file.path}`  // Include the full URL to access the image
    });
    
  } catch (err) {
    console.error('Error saving alumni data:', err);
    res.status(500).json({ success: false, message: 'Error saving alumni data' });
  }
});

app.get('/alumni', async (req, res) => {
  try {
    const alumni = await Alumni.find();
    res.status(200).json({ success: true, alumni });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch alumni data' });
  }
});

// Route to create a new thread (Add this here)
app.post('/createThread', async (req, res) => {
  const { title, creator } = req.body;

  if (!title || !creator) {
    return res.status(400).json({ success: false, message: 'Title and creator are required' });
  }

  try {
    const newThread = new Thread({
      title,
      creator,
      messages: [],  // Start with an empty message array
    });

    await newThread.save();
    res.status(201).json({ success: true, thread: newThread });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create thread' });
  }
});

// Route to fetch threads
app.get('/threads', async (req, res) => {
  try {
    const threads = await Thread.find();  // Fetch all threads from the database
    res.status(200).json({ success: true, threads });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch threads' });
  }
});

// Route to handle posting a message
app.post('/sendMessage', async (req, res) => {
  const { threadId, sender, text } = req.body;

  try {
    const newMessage = new Message({
      thread: threadId,  // Reference to the thread
      sender,
      text,
      timestamp: new Date(),
    });

    await newMessage.save();

    // Optionally, update the thread with the new message
    await Thread.findByIdAndUpdate(threadId, {
      $push: { messages: newMessage._id },
    });

    // Respond with the new message
    res.status(200).json({ success: true, message: newMessage });
  } catch (err) {
    console.error('Error posting message:', err);
    res.status(500).json({ success: false, message: 'Failed to post message' });
  }
});



// Socket.IO Setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinThread', async (threadId) => {
    try {
      socket.join(threadId);
      const messages = await Message.find({ thread: threadId }).sort({ timestamp: 1 });
      socket.emit('previousMessages', messages);
    } catch (err) {
      socket.emit('error', { message: 'Failed to join thread' });
    }
  });

  socket.on('sendMessage', async (data) => {
    const { threadId, sender, text } = data;

    try {
      // Create and save the new message
      const newMessage = new AMAMessage({ thread: threadId, sender, text });
      await newMessage.save();

      // Emit the new message to everyone in the thread
      io.to(threadId).emit('message', {
        threadId: threadId,
        sender: sender,
        text: text,
        timestamp: newMessage.timestamp, // Include the timestamp from the saved message
      });

      // Optionally, you can also emit the saved message to the sender
      socket.emit('message', {
        threadId: threadId,
        sender: sender,
        text: text,
        timestamp: newMessage.timestamp,
      });

    } catch (err) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});




// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ success: false, message: err.message });
});

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
