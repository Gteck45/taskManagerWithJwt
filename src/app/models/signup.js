import mongoose from "mongoose";
const Schema = mongoose.Schema;

import dbConnect from '../../lib/db';

dbConnect();

// Add validation and error handling in schema
const signupSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
}, {
  timestamps: true
});

// Enhanced error handling middleware
signupSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Email already exists'));
  } else if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    next(new Error(messages.join(', ')));
  } else {
    next(error);
  }
});

const Signup = mongoose.models.Signup || mongoose.model('Signup', signupSchema);

export default Signup;
