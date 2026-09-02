import { connectDB } from "@/config/connectDB";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as jose from 'jose'

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
    else if (query === 'admin') {

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
                name, email, password: hashed, isVerified: true, role: 'admin'
            });

            await newUser.save();

            return NextResponse.json({
                success: true,
                message: `Admin created`,
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

            if (found.role === 'user' && !found.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: `Account not approved yet`,
                }, { status: 401 });
            }

            if (found.role !== option) {
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

export async function GET(req: NextRequest) {

    await connectDB();

    const query = req.url.split("=")[1];

    if (query === 'verify') {
        try {
            const token = req.cookies.get('token')?.value;
            const payload = jose.decodeJwt(token as string);

            const { email } = payload;

            const found = await User.findOne({ email });

            return NextResponse.json({
                success: true,
                message: `User Fetched`,
                found
            }, { status: 200 });
        } catch (error) {
            console.log("VERIFY ERROR", error);
            return NextResponse.json({
                success: false,
                message: `SOMETHING WENT WRONG`,
            }, { status: 500 });
        }
    }
    else if (query === 'fetch') {

        try {
            const found = await User.find();

            return NextResponse.json({
                success: true,
                message: `Pending requests fetched`,
                found
            }, { status: 200 });
        } catch (error) {
            console.log("PENDING REQUESTS ERROR", error);
            return NextResponse.json({
                success: false,
                message: `SOMETHING WENT WRONG`,
            }, { status: 500 });
        }
    }
    else if (query === 'admins') {

        try {
            const found = await User.find({ role: 'admin' }).select('-password');

            return NextResponse.json({
                success: true,
                message: `Admins fetched`,
                found
            }, { status: 200 });
        } catch (error) {
            console.log("ADMINS FETCH ERROR", error);
            return NextResponse.json({
                success: false,
                message: `SOMETHING WENT WRONG`,
            }, { status: 500 });
        }
    }

    return NextResponse.json({
        success: false,
        message: `SOMETHING WENT WRONG`,
    }, { status: 404 });
}

export async function PUT(req: NextRequest) {
    await connectDB();

    const body = await req.json();
    const { email } = body;

    console.log(email)

    try {
        const found = await User.findOneAndUpdate({ email });

        if (found) {
            found.isVerified = true;
            await found.save();

            return NextResponse.json({
                success: true,
                message: `User Verified`,
            }, { status: 300 });
        }
    } catch (error) {
        console.log("APPROVE ERROR", error);
        return NextResponse.json({
            success: false,
            message: `SOMETHING WENT WRONG`,
        }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    await connectDB();

    const url = new URL(req.url);
    const query = url.searchParams.get('type');

    if (query === 'delete-admin') {
        const id = url.searchParams.get('id');

        try {
            const found = await User.findOneAndDelete({ _id: id, role: 'admin' });

            if (!found) {
                return NextResponse.json({
                    success: false,
                    message: `Admin not found`,
                }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                message: `Admin deleted`,
            }, { status: 200 });
        } catch (error) {
            console.log("ADMIN DELETE ERROR", error);
            return NextResponse.json({
                success: false,
                message: `SOMETHING WENT WRONG`,
            }, { status: 500 });
        }
    }

    const email = url.searchParams.get('email');

    try {
        const found = await User.findOneAndDelete({ email });

        return NextResponse.json({
            success: true,
            message: `User deleted`,
        }, { status: 200 });
    } catch (error) {
        console.log("DELETE ERROR", error);
        return NextResponse.json({
            success: false,
            message: `SOMETHING WENT WRONG`,
        }, { status: 500 });
    }
}