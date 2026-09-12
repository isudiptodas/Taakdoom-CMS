import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    client1: { type: String, required: true },
    jobDetails1: { type: String, required: true },
    startTime1: { type: String, required: true },
    endTime1: { type: String, required: true },
    duration1: { type: String, required: true },
    remarks1: { type: String, required: true },
    client2: { type: String, required: false },
    jobDetails2: { type: String, required: false },
    startTime2: { type: String, required: false },
    endTime2: { type: String, required: false },
    duration2: { type: String, required: false },
    remarks2: { type: String, required: false },
    client3: { type: String, required: false },
    jobDetails3: { type: String, required: false },
    startTime3: { type: String, required: false },
    endTime3: { type: String, required: false },
    duration3: { type: String, required: false },
    remarks3: { type: String, required: false },
    client4: { type: String, required: false },
    jobDetails4: { type: String, required: false },
    startTime4: { type: String, required: false },
    endTime4: { type: String, required: false },
    duration4: { type: String, required: false },
    remarks4: { type: String, required: false },
    fileLink1: { type: String, required: false },
    fileLink2: { type: String, required: false },
    fileLink3: { type: String, required: false },
    fileLink4: { type: String, required: false },
    source: { type: String, enum: ["cms", "google-form"], required: true }
}, { timestamps: true });

export const WorkLogEntry = mongoose.models.Entry || mongoose.model("Entry", entrySchema);