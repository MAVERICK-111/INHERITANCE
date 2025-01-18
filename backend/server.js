const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // For checking and creating the 'uploads' directory

const Hobby = require('./models/hobby'); // Hobby model for storing groups
const Message = require('./models/Message'); // Message model for storing chat messages
require("dotenv").config();

const authRoutes = require("./routes/authRoutes"); // Auth routes module
// Removed `authModules` since it's undefined and not required
const chatRoutes = require("./routes/chat");


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

// Create 'uploads' directory if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/amaApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Models
const Hobby = require('./models/hobby');
const Message = require('./models/message');
const Thread = require('./models/thread');

// Alumni Schema
const alumniSchema = new mongoose.Schema({
  photo: { type: String, required: true },
  info: { type: String, required: true }, // You can set info as required if it's critical
});

const Alumni = mongoose.model('Alumni', alumniSchema);

// Middleware for handling multipart/form-data
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Store with timestamp
  },
});
const upload = multer({ storage: storage });

// Serve static files for image upload
app.use('/uploads', express.static(uploadDir));

// Routes for hobbies
app.post('/createHobby',
  [check('name').notEmpty().withMessage('Hobby name is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    try {
      const newHobby = new Hobby({ name });
      await newHobby.save();
      res.status(201).send({ success: true, hobby: newHobby });
    } catch (err) {
      res.status(500).send({ success: false, message: 'Failed to create hobby' });
    }
  }
);

app.get('/hobbies', async (req, res) => {
  try {
    const hobbies = await Hobby.find();
    res.status(200).send({ success: true, hobbies });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to fetch hobbies' });
  }
});

// AMA Routes (for threads)
app.post('/createThread',
  [check('title').notEmpty().withMessage('Thread title is required'),
   check('creator').notEmpty().withMessage('Creator name is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, creator } = req.body;
    try {
      const newThread = new Thread({ title, creator });
      await newThread.save();
      res.status(201).send({ success: true, thread: newThread });
    } catch (err) {
      console.error("Error creating thread:", err);  
      res.status(500).send({ success: false, message: 'Failed to create thread' });
    }
  }
);

// Fetching threads
app.get('/threads', async (req, res) => {
  try {
    const threads = await Thread.find();
    res.status(200).send({ success: true, threads });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to fetch threads' });
  }
});

// Delete thread
app.delete('/deleteThread/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const thread = await Thread.findByIdAndDelete(id);
    if (thread) {
      res.status(200).send({ success: true, message: 'Thread deleted' });
    } else {
      res.status(404).send({ success: false, message: 'Thread not found' });
    }
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to delete thread' });
  }
});


// Routes for alumni (handle file upload and information)
app.post('/alumni', upload.single('photo'), (req, res) => {
  console.log('File:', req.file);   // Log the uploaded file
  console.log('Info:', req.body.info);   // Log the information about the alumni

  if (!req.file) {
    return res.status(400).send('No photo uploaded.');
  }

  const newAlumni = new Alumni({
    photo: req.file.path, // Store the path of the uploaded file
    info: req.body.info,
  });

// Routes for auth
app.use("/api/auth", authRoutes); // Use `authRoutes` instead of undefined `authModules`

// Socket setup for chat messages
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', async (data) => {
    const { room, sender, text } = data;

    // Save the message to the database
    const newMessage = new Message({ room, sender, text });
    await newMessage.save();


  newAlumni.save((err) => {
    if (err) {
      console.error('Error details:', err); // This will log the full error in the backend console
      return res.status(500).send('Error saving alumni data.');
    }
    res.status(200).send('Alumni data saved successfully!');
  });
});



// Route to fetch all alumni
app.get('/alumni', async (req, res) => {
  try {
    const alumni = await Alumni.find();
    res.status(200).send({ success: true, alumni });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to fetch alumni data' });
  }
});

// Routes for sending messages
app.post('/sendMessage',
  [check('threadId').notEmpty().withMessage('Thread ID is required'),
   check('sender').notEmpty().withMessage('Sender is required'),
   check('text').notEmpty().withMessage('Text is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { threadId, sender, text } = req.body;

    try {
      // Check if thread exists
      const thread = await Thread.findById(threadId);
      if (!thread) {
        return res.status(404).send({ success: false, message: 'Thread not found' });
      }

      const newMessage = new Message({ thread: threadId, sender, text });
      await newMessage.save();
      res.status(201).send({ success: true, message: newMessage });
    } catch (err) {
      res.status(500).send({ success: false, message: 'Failed to send message' });
    }
  }
);

// Route to fetch messages for a specific thread
app.get('/messages/:threadId', async (req, res) => {
  const { threadId } = req.params;
  try {
    const messages = await Message.find({ thread: threadId })
      .sort({ timestamp: -1 })  // Sort messages by timestamp, descending
      .exec();

    if (!messages.length) {
      return res.status(404).send({ success: false, message: 'No messages found for this thread' });
    }

    res.status(200).send({ success: true, messages: messages.reverse() });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to fetch messages' });
  }
});

// Socket.IO Setup
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinThread', async (threadId) => {
    socket.join(threadId);

    const messages = await Message.find({ thread: threadId })
      .sort({ timestamp: -1 })
      .limit(10)
      .exec();
    socket.emit('previousMessages', messages.reverse());
  });

  socket.on('sendMessage', async (data) => {
    const { threadId, sender, text } = data;


    try {
      const newMessage = new Message({ thread: threadId, sender, text });
      await newMessage.save();
      io.to(threadId).emit('message', data);
    } catch (err) {
      socket.emit('error', { message: 'Failed to save message' });
    }

    // Send the messages to the user
    socket.emit('previousMessages', messages.reverse()); // Send messages in chronological order

  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ success: false, message: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});

