import { connectDB } from "@/config/connectDB";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {

    await connectDB();

    const body = await req.json();
    const query = req.url.split("=")[1];

    if (query === 'register') {

        const { name, email, password } = body;
        try {

            const found = await User.findOne({ email });

            if (found) {
                return NextResponse.json({
                    success: false,
                    message: `User already exists`,
                }, { status: 401 });
            }

            const hashed = await bcrypt.hash(password, 10);

            const newUser = new User({
                name, email, password: hashed
            });

            await newUser.save();

            return NextResponse.json({
                success: true,
                message: `User created`,
            }, { status: 201 });
        } catch (error) {
            console.log("AUTH ERROR", error);
            return NextResponse.json({
                success: false,
                message: `SOMETHING WENT WRONG`,
            }, { status: 500 });
        }
    }
    else if (query === 'login') {

        const { email, password, option } = body;
        try {

            const found = await User.findOne({ email });

            if (!found) {
                return NextResponse.json({
                    success: false,
                    message: `User not found`,
                }, { status: 404 });
            }

            if(found.role === 'user' && !found.isVerified){
                return NextResponse.json({
                    success: false,
                    message: `Account not approved yet`,
                }, { status: 401 });
            }

            if(found.role !== option){
                return NextResponse.json({
                    success: false,
                    message: `Authorization error`,
                }, { status: 401 });
            }

            const matched = await bcrypt.compare(password, found.password);

            if (!matched) {
                return NextResponse.json({
                    success: false,
                    message: `Password Incorrect`,
                }, { status: 403 });
            }

            const token = jwt.sign({ id: found._id, email: found.email, role: option }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

            const res = NextResponse.json({
                success: true,
                message: `Logged in`,
                role: option === 'user' ? "user" : "admin"
            }, { status: 200 });

            res.cookies.set("token", token, {
                path: "/",
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7,
            })

            return res;
        } catch (error) {
            console.log("AUTH ERROR", error);
            return NextResponse.json({
                success: false,
                message: `SOMETHING WENT WRONG`,
            }, { status: 500 });
        }
    }
}