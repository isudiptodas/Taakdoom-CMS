import { connectDB } from "@/config/connectDB";
import { WorkLogEntry } from "@/models/WorkLogEntry";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectDB();

    const body = await req.json();
    const {
        name,
        date,
        client1,
        jobDetails1,
        startTime1,
        endTime1,
        duration1,
        remarks1,
        client2,
        jobDetails2,
        startTime2,
        endTime2,
        duration2,
        remarks2,
        client3,
        jobDetails3,
        startTime3,
        endTime3,
        duration3,
        remarks3,
        client4,
        jobDetails4,
        startTime4,
        endTime4,
        duration4,
        remarks4,
        fileLink1,
        fileLink2,
        fileLink3,
        fileLink4,
        source
    } = body;

    try {

        const newEntry = new WorkLogEntry({
            name,
            date,
            client1,
            jobDetails1,
            startTime1,
            endTime1,
            duration1,
            remarks1,
            client2,
            jobDetails2,
            startTime2,
            endTime2,
            duration2,
            remarks2,
            client3,
            jobDetails3,
            startTime3,
            endTime3,
            duration3,
            remarks3,
            client4,
            jobDetails4,
            startTime4,
            endTime4,
            duration4,
            remarks4,
            fileLink1,
            fileLink2,
            fileLink3,
            fileLink4,
            source: "cms"
        });

        await newEntry.save();
        
        return NextResponse.json({
            success: true,
            message: "Entry created"
        }, { status: 201 });
    } catch (error) {
        console.log(`ERROR ENTRY ->`, error);
        return NextResponse.json({
            success: false,
            message: "SOMETHING WENT WRONG"
        }, { status: 500 });
    }
}

