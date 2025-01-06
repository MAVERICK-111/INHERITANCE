const express = require('express');
const mongoose = require('mongoose');
const hobbiesRoutes = require('./routes/hobbies');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/hobbies', hobbiesRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hobbiesApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
