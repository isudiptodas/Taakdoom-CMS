import { PasswordRecoveryEmail } from "@/components/PasswordRecoveryEmailTemplate";
import { connectDB } from "@/config/connectDB";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { data } = body;

    await connectDB();

    try {

        const { email, otp } = body;

        const found = await User.findOne({ email });

        if (!found) {
            return NextResponse.json({
                success: false,
                message: `User not exists`,
            }, { status: 404 })
        }

        const { data: emailData, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['marketing@taakdoom.com'],
            subject: 'Taakdoom CMS Password Recovery',
            react: PasswordRecoveryEmail({ email, otp }),
        });

        if (error) {
            console.log(error);
            return Response.json({ error }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Message sent`,
        }, { status: 200 })
    } catch (error) {
        console.log("ERROR -> ", error);
        return NextResponse.json({
            success: false,
            message: `SOMETHING WENT WRONG`,
        }, { status: 500 })
    }
}