import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Signup from '../../models/signup';
import Task from '../../models/tasks';
import dbConnect from '../../../lib/db';

export async function POST(request) {
    await dbConnect();

    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ message: 'JWT token is required' }, { status: 400 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id.email) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const tasks = await Task.find({ createdBy: decoded.id.email });
        return NextResponse.json(tasks, { status: 200 });

    } catch (error) {
        console.error('Error in getTask API:', error);
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}


export async function PUT(request) {
    await dbConnect();
    try {
        const { token, _id, status, title, description,date } = await request.json();
        
        if (!token) {
            return NextResponse.json({ message: 'JWT token is required' }, { status: 400 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id.email) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            _id,
            {
                title,
                description,
                status,
                 date
            },
            { new: true }
        );

        if (!updatedTask) {
            return NextResponse.json({ message: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTask, { status: 200 });
    }
    catch (error) {
        console.error('Error in updateTask API:', error);
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}


export async function DELETE(request) {
    await dbConnect();
    try {
        const { token, _id } = await request.json();
        
        if (!token) {
            return NextResponse.json({ message: 'JWT token is required' }, { status: 400 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);  

        if (!decoded || !decoded.id.email) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        await Task.findByIdAndDelete(_id);

        return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
    }
    catch (error) {
        console.error('Error in deleteTask API:', error);
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}