import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    jobName: { type: String, required: true }, uuid: { type: String, required: true, unique: true },
    clientName: { type: String, required: true }, AssignTo: { type: [String], required: true },
    startTime: { type: String, required: true }, endTime: { type: String, required: true }, plannedDeliveryDate: { type: String, default: "" },
    actualDeliveryDate: { type: String, default: "" }, completedAt: { type: Date, default: null }, delay: { type: String, default: "" },
    status: { type: String, required: false, default: "" },
    remarks: { type: String, default: "" }, latestUpdate: { type: String, default: "" }, phoneNumber: { type: [String], required: true }, billingRaised: { type: Boolean, default: false },
    paymentReceived: { type: Boolean, default: false },
}, { timestamps: true });

const existingJob = mongoose.models.Job;
if (existingJob && (existingJob.schema.path("AssignTo")?.instance !== "Array" || existingJob.schema.path("phoneNumber")?.instance !== "Array")) {
    delete mongoose.models.Job;
}

export const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);