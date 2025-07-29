import { NextResponse, NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

import signup from "../../models/signup";

export async function POST(request) {
    const secret = process.env.JWT_SECRET;
    console.log(secret)
    try {
        const req = await request.json();
        const { email, password } = req;
        const user = await signup.findOne({ email });
        if (!user) {
            return NextResponse.json({
                message: "Invalid Credentials"
            }, { status: 401 })
        }
        if (!(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({
                message: "Invalid Credentials"
            }, { status: 401 })
        }
        const id = {_id:user._id,email:user.email};
        const token = jwt.sign({ id }, secret, { expiresIn: "1h" })
        return NextResponse.json({
            ok:true,
            message: "Login Successful",
            token: token
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 })
    }
}
