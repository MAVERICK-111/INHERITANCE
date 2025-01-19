const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

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
app.use(express.json());

// MongoDB Connection
const connectDB = require('./config/db');  // This imports the connectDB function
connectDB();

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// Routes
const alumniRoutes = require("./routes/authRoutes");
const amaRoutes = require("./routes/amaRoutes");
const authRoutes = require("./routes/authRoutes");
const hobbyRoutes = require("./routes/hobbyRoute");
const messageRoutes = require("./routes/messageRoutes");
const threadRoutes = require('./routes/threadRoutes');
const userRoutes = require("./routes/userRoutes");

app.use('/api/alumni', alumniRoutes);
app.use('/api/AMA', amaRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/hobbies', hobbyRoutes);
app.use('/api/users', userRoutes);

// Serve static files
app.use('/uploads', express.static(uploadDir));

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
const errorMiddleware = require("./middleware/errorHandler");
app.use(errorMiddleware);

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));