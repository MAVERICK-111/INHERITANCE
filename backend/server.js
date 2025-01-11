const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Hobby = require('./models/hobby');  // Hobby model for storing groups
const Message = require('./models/Message');  // Message model for storing chat messages

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hobbyApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes for hobbies
app.post('/createHobby', async (req, res) => {
  const { name } = req.body;
  try {
    const newHobby = new Hobby({ name });
    await newHobby.save();
    res.status(201).send({ success: true, hobby: newHobby });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to create hobby' });
  }
});

app.get('/hobbies', async (req, res) => {
  try {
    const hobbies = await Hobby.find();
    res.status(200).send({ success: true, hobbies });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to fetch hobbies' });
  }
});

// Delete a hobby
app.delete('/deleteHobby/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const hobby = await Hobby.findByIdAndDelete(id);
    if (hobby) {
      res.status(200).send({ success: true, message: 'Hobby deleted' });
    } else {
      res.status(404).send({ success: false, message: 'Hobby not found' });
    }
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to delete hobby' });
  }
});

// Socket setup for chat messages
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', async (data) => {
    const { room, sender, text } = data;
    
    // Save the message to the database
    const newMessage = new Message({ room, sender, text });
    await newMessage.save();

    // Broadcast the message to the room
    io.to(room).emit('message', data);
  });

  socket.on('joinRoom', async (room) => {
    console.log(`User ${socket.id} joined room: ${room}`);
    socket.join(room);

    // Fetch last 10 messages for the room
    const messages = await Message.find({ room })
      .sort({ timestamp: -1 })
      .limit(10)
      .exec();

    // Send the messages to the user
    socket.emit('previousMessages', messages.reverse());  // Send messages in chronological order
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
