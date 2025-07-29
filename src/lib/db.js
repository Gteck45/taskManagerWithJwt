import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI; // Use the tasks database for now, can be made configurable later

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true, // Deprecated but good to keep for older Mongoose versions
      useUnifiedTopology: true // Deprecated but good to keep for older Mongoose versions
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
}

export default dbConnect;
