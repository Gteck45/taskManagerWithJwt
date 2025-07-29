import mongoose from 'mongoose';
import dbConnect from '../../lib/db';

dbConnect();

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'in progress', 'completed']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Signup', // Reference to the Signup model
        required: true // Assuming a task must be created by a registered user
    }
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default Task;
