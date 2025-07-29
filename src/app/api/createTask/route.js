import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Signup from '../../models/signup';
import Task from '../../models/tasks';
import dbConnect from '../../../lib/db';

export async function POST(request) {
    try {
        await dbConnect(); // Ensure DB connection is established
        const body = await request.json();
        const token = body.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return NextResponse.json({ success: false, message: "Authentication token is required" }, { status: 400 });
        }
        delete body.token;
        console.log(body)
        const { title, description, dueDate } = body;
        const newTask = new Task({
            title,
            description,
            dueDate,
            createdBy: decoded.id.email,
        });
        await Task.create(newTask); // Changed Task.create() to newTask.save()
        
        return NextResponse.json({ success: true, message: "Task created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error); // Log the error for debugging
        return NextResponse.json({ success: false, message: "Failed to create task" }, { status: 500 });
    }
}
