import { connectDB } from "@/config/connectDB";
import { Job } from "@/models/Job";
import { NextRequest, NextResponse } from "next/server";

const statusOptions = ["", "started", "not completed", "waiting for feedback", "hold", "work in progress", "completed", "not started"];

export async function POST(req: NextRequest) {
    if (new URL(req.url).searchParams.get("type") !== "create") {
        return NextResponse.json({ success: false, message: "Invalid job request" }, { status: 400 });
    }
    try {
        await connectDB();
        const body = await req.json();
        const requiredFields = ["jobName", "uuid", "clientName", "AssignTo", "startTime", "endTime", "phoneNumber"];
        if (requiredFields.some((field) => !body[field])) {
            return NextResponse.json({ success: false, message: "Please complete all required fields" }, { status: 400 });
        }
        if (!statusOptions.includes(body.status)) {
            return NextResponse.json({ success: false, message: "Invalid job status" }, { status: 400 });
        }
        const job = await Job.create({ ...body, status: body.status });
        return NextResponse.json({ success: true, message: "Job created", job }, { status: 201 });
    } catch (error: unknown) {
        console.log("CREATE JOB ERROR", error);
        const duplicate = typeof error === "object" && error !== null && "code" in error && error.code === 11000;
        return NextResponse.json({ success: false, message: duplicate ? "A job with this ID already exists" : "Something went wrong" }, { status: duplicate ? 409 : 500 });
    }
}

export async function GET(req: NextRequest) {
    if (new URL(req.url).searchParams.get("type") !== "fetch") {
        return NextResponse.json({ success: false, message: "Invalid job request" }, { status: 400 });
    }
    try {
        await connectDB();
        const found = await Job.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, message: "Jobs fetched", found }, { status: 200 });
    } catch (error) {
        console.log("FETCH JOBS ERROR", error);
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}