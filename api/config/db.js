const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

// Function to connect to MongoDB using Mongoose
async function connectDB() {
  try {
    // Connect to MongoDB with the provided URI and options
    await mongoose.connect(uri, {
      useNewUrlParser: true, // Allows MongoDB to use the new connection string parser
      useUnifiedTopology: true, // Allows MongoDB to use the new server discovery and monitoring engine
      serverApi: {
        version: '1', // Use the Stable API version
      },
    });

    console.log("Successfully connected to MongoDB using Mongoose!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connectDB;