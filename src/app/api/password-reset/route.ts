import { connectDB } from "@/config/connectDB";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { data } = body;

    await connectDB();

    try {

        const { email, password } = body;

        const found = await User.findOne({ email });

        if (!found) {
            return NextResponse.json({
                success: false,
                message: `User not exists`,
            }, { status: 404 })
        }

        const hashed = await bcrypt.hash(password, 10);

        found.password = hashed;
        await found.save();

        return NextResponse.json({
            success: true,
            message: `Password changed`,
        }, { status: 200 })
    } catch (error) {
        console.log("ERROR -> ", error);
        return NextResponse.json({
            success: false,
            message: `SOMETHING WENT WRONG`,
        }, { status: 500 })
    }
}