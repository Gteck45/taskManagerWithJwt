import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Task from '../../models/tasks';
import dbConnect from '../../../lib/db';

// Helper function to extract and verify token
async function verifyToken(request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { error: 'Authentication token is required', status: 401 };
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    try {
        const decoded = jwt.verify(token, secret);
        if (!decoded || !decoded.id || !decoded.id._id) {
            return { error: 'Invalid token payload', status: 401 };
        }
        return { decoded };
    } catch (error) {
        console.error('Token verification error:', error);
        return { error: 'Invalid or expired token', status: 401 };
    }
}

export async function GET(request) { // Changed from POST to GET for fetching tasks
    await dbConnect();

    try {
        const { decoded, error, status } = await verifyToken(request);
        if (error) {
            return NextResponse.json({ message: error }, { status });
        }

        const tasks = await Task.find({ createdBy: decoded.id._id }); // Query by user's _id
        return NextResponse.json(tasks, { status: 200 });

    } catch (error) {
        console.error('Error in getTask API:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}


export async function PUT(request) {
    await dbConnect();
    try {
        const { decoded, error, status } = await verifyToken(request);
        if (error) {
            return NextResponse.json({ message: error }, { status });
        }

        const { _id, status: taskStatus, title, description, date } = await request.json();
        
        const updatedTask = await Task.findOneAndUpdate(
            { _id: _id, createdBy: decoded.id._id }, // Ensure user can only update their own tasks
            {
                title,
                description,
                status: taskStatus,
                date
            },
            { new: true }
        );

        if (!updatedTask) {
            return NextResponse.json({ message: 'Task not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json(updatedTask, { status: 200 });
    }
    catch (error) {
        console.error('Error in updateTask API:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}


export async function DELETE(request) {
    await dbConnect();
    try {
        const { decoded, error, status } = await verifyToken(request);
        if (error) {
            return NextResponse.json({ message: error }, { status });
        }

        const { _id } = await request.json();
        
        const deletedTask = await Task.findOneAndDelete({ _id: _id, createdBy: decoded.id._id }); // Ensure user can only delete their own tasks

        if (!deletedTask) {
            return NextResponse.json({ message: 'Task not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
    }
    catch (error) {
        console.error('Error in deleteTask API:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
