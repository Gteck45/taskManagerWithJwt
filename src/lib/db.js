import mongoose from 'mongoose';

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const MONGODB_URI = process.env.MONGO_URI;

  if (!MONGODB_URI) {
    console.error('MongoDB connection string (MONGO_URI) is not defined in environment variables.');
    throw new Error('MongoDB connection failed: MONGO_URI is not defined.');
  }

  try {
    await mongoose.connect(MONGODB_URI); // Removed deprecated options
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
}

export default dbConnect;
