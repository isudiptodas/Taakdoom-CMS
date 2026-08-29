import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: false, default: 'user' },
    isVerified: { type: Boolean, required: false, default: false }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", userSchema);