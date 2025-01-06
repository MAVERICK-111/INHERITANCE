const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // No need for `useNewUrlParser` and `useUnifiedTopology`
        console.log('Database connected');
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;

