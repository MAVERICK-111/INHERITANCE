const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { check, validationResult } = require('express-validator');

// Models
const Hobby = require('./models/hobby');
const Message = require('./models/message');
const Thread = require('./models/thread');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow both origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/amaApp', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Hobbies Routes
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

app.get('/threads', async (req, res) => {
  try {
    const threads = await Thread.find();
    res.status(200).send({ success: true, threads });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to fetch threads' });
  }
});

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

// Routes for messages
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
  console.log('Fetching messages for thread ID:', threadId);

  try {
    const messages = await Message.find({ thread: threadId })
      .sort({ timestamp: -1 })  // Sort messages by timestamp, descending
      .exec();

    if (!messages.length) {
      console.log('No messages found for this thread');
      return res.status(404).send({ success: false, message: 'No messages found for this thread' });
    }

    res.status(200).send({ success: true, messages: messages.reverse() });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).send({ success: false, message: 'Failed to fetch messages' });
  }
});


// Socket.IO Setup
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinThread', async (threadId) => {
    console.log(`User joined thread: ${threadId}`);
    socket.join(threadId);

    // Fetch the last 10 messages for the thread and emit to the client
    const messages = await Message.find({ thread: threadId })
      .sort({ timestamp: -1 })
      .limit(10)
      .exec();
    socket.emit('previousMessages', messages.reverse());  // Send messages in chronological order
  });

  socket.on('sendMessage', async (data) => {
    const { threadId, sender, text } = data;

    try {
      const newMessage = new Message({ thread: threadId, sender, text });
      await newMessage.save();
      io.to(threadId).emit('message', data);
    } catch (err) {
      console.error('Error saving message:', err);
      socket.emit('error', { message: 'Failed to save message' });
    }
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
