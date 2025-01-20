//const mongoose = require('mongoose');

//const connectDB = async () => {
 //   try {
   //     await mongoose.connect(process.env.MONGO_URI); // No need for `useNewUrlParser` and `useUnifiedTopology`
     //   console.log('Database connected');
    //} catch (err) {
      //  console.error('Database connection failed:', err);
        //process.exit(1); // Exit process with failure
    //}
//};

//module.exports = connectDB;

/**
* Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
* See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
*/


const uri = "mongodb+srv://harshogale04:Harsh%401234@cluster0.4y9k1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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

