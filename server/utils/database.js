const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the URI defined in .env
 * Exits the process if connection fails since the API cannot function without a DB.
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
