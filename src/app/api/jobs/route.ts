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
        const requiredFields = ["jobName", "clientName", "startTime", "endTime", "phoneNumber"];
        if (requiredFields.some((field) => !body[field]) || !Array.isArray(body.AssignTo) || body.AssignTo.length === 0 || !Array.isArray(body.phoneNumber) || body.phoneNumber.length === 0) {
            return NextResponse.json({ success: false, message: "Please complete all required fields" }, { status: 400 });
        }
        if (!statusOptions.includes(body.status)) {
            return NextResponse.json({ success: false, message: "Invalid job status" }, { status: 400 });
        }
        const jobsCount = await Job.countDocuments();
        let jobNumber = jobsCount + 1;
        let uuid = `JOB-${String(jobNumber).padStart(3, "0")}`;

        while (await Job.exists({ uuid })) {
            jobNumber += 1;
            uuid = `JOB-${String(jobNumber).padStart(3, "0")}`;
        }

        const job = await Job.create({ ...body, uuid, status: body.status, completedAt: body.status === "completed" ? new Date() : null });
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

export async function PUT(req: NextRequest) {
    const url = new URL(req.url);
    const query = url.searchParams.get("type");

    if (query !== "update" && query !== "client-update") {
        return NextResponse.json({ success: false, message: "Invalid job request" }, { status: 400 });
    }
    try {
        await connectDB();
        if (query === "client-update") {
            const clientName = url.searchParams.get("clientName");
            const { latestUpdate } = await req.json();

            if (!clientName) {
                return NextResponse.json({ success: false, message: "Client not found" }, { status: 400 });
            }

            await Job.updateMany({ clientName }, { $set: { latestUpdate: latestUpdate || "" } });
            return NextResponse.json({ success: true, message: "Client update saved" }, { status: 200 });
        }

        const id = url.searchParams.get("id");
        const body = await req.json();
        const requiredFields = ["jobName", "uuid", "clientName", "startTime", "endTime", "phoneNumber"];
        if (!id || requiredFields.some((field) => !body[field]) || !Array.isArray(body.AssignTo) || body.AssignTo.length === 0 || !Array.isArray(body.phoneNumber) || body.phoneNumber.length === 0) {
            return NextResponse.json({ success: false, message: "Please complete all required fields" }, { status: 400 });
        }
        if (!statusOptions.includes(body.status)) {
            return NextResponse.json({ success: false, message: "Invalid job status" }, { status: 400 });
        }
        const existingJob = await Job.findById(id);
        if (!existingJob) {
            return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
        }

        const updateData = {
            ...body,
            completedAt: body.status === "completed"
                ? existingJob.status === "completed" ? existingJob.completedAt : new Date()
                : null,
        };
        const job = await Job.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        return NextResponse.json({ success: true, message: "Job updated", job }, { status: 200 });
    } catch (error: unknown) {
        console.log("UPDATE JOB ERROR", error);
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}