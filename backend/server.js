const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/ama', require('./routes/amaRoutes')); // Corrected position for amaRoutes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
