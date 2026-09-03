import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    jobName: { type: String, required: true }, uuid: { type: String, required: true, unique: true },
    clientName: { type: String, required: true }, AssignTo: { type: String, required: true },
    startTime: { type: String, required: true }, endTime: { type: String, required: true },
    actualDeliveryDate: { type: String, default: "" }, delay: { type: String, default: "" },
    status: { type: String, required: false, default: "" }, phoneNumber: { type: String, required: true },
    remarks: { type: String, default: "" }, billingRaised: { type: Boolean, default: false },
    paymentReceived: { type: Boolean, default: false },
}, { timestamps: true });

export const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);