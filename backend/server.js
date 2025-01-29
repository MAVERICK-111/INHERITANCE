const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { setupSocket } = require('./utils/socket');
require('dotenv').config();

// Server
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000','http://localhost:3001'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type'],
  },
});
const {setSocket} = require("./controllers/AMAMessageController")
setupSocket(io);
setSocket(io);
module.exports = {io};

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectDB = require('./config/db');
connectDB();

// Uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// Routes
const AlumniRoutes = require("./routes/alumniRoutes");
const AMAThreadRoutes = require("./routes/AMAThreadRoutes");
const AMAMessageRoutes = require("./routes/AMAMessageRoute");
const HobbyThreadRoutes = require("./routes/HobbyThreadRoutes");
const HobbyMessageRoutes = require("./routes/HobbyMessageRoute");
const UserRoutes = require("./routes/UserRoutes");
const noticeRoutes = require('./routes/noticeRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/api/alumni', AlumniRoutes);
app.use('/api', AMAThreadRoutes);
app.use('/api', AMAMessageRoutes);
app.use('/api', HobbyMessageRoutes);
app.use('/api', HobbyThreadRoutes);
app.use('/api/users',UserRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/posts', postRoutes);

//static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error Handling Middleware
const errorMiddleware = require("./middleware/errorHandler");
app.use(errorMiddleware);

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));