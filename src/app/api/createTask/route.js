import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Task from '../../models/tasks';
import dbConnect from '../../../lib/db';

export async function POST(request) {
    try {
        await dbConnect(); // Ensure DB connection is established

        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: "Authentication token is required" }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const decoded = jwt.verify(token, secret);

        if (!decoded || !decoded.id || !decoded.id._id) {
            return NextResponse.json({ success: false, message: "Invalid token payload" }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, date } = body; // Changed dueDate to date

        const newTask = new Task({
            title,
            description,
            date, // Use 'date' field
            createdBy: decoded.id._id, // Use user's _id from token
        });

        await newTask.save(); // Corrected to save()

        return NextResponse.json({ success: true, message: "Task created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error); // Log the error for debugging
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }
        return NextResponse.json({ success: false, message: "Failed to create task" }, { status: 500 });
    }
}
