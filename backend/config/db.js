/*const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // No need for `useNewUrlParser` and `useUnifiedTopology`
        console.log('Database connected');
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;*/



const uri = process.env.MONGO_URI;
const { MongoClient, ServerApiVersion } = require('mongodb');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Function to connect to MongoDB
async function connectDB() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connectDB;

///* MONGO_URI=mongodb://localhost:27017/AMA
//JWT_SECRET=your_jwt_secret
//PORT=5000
//AUTH0_DOMAIN=dev-ucsp4ge1ss5vocyz.us.auth0.com
//AUTH0_AUDIENCE=https://dev-ucsp4ge1ss5vocyz.us.auth0.com/api/v2/ 

