import { NextResponse, NextRequest } from "next/server";
import signup from "../../models/signup";
import bcrypt from "bcrypt";

export async function POST(request){  // Added request parameter
    try {
        const req = await request.json();  // Changed NextRequest to request
        let {email, password} = req;
        password = await bcrypt.hash(password, 10);
        const user = await signup.findOne({email});  // Remove password from query
        if(user){
            return NextResponse.json({
                message: "User already exists",
                serverCode:400
            }, { status: 400 })
        }

        await signup.create({email, password});
        return NextResponse.json({
            message: "Signup Successful"  // Fixed typo and removed password from response
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({
            message: "Error in signup",
            error: error.message
        }, { status: 500 })
    }
}
