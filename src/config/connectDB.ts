import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Database Connected");
    } catch (error) {
        console.log("ERROR CONNECTING DB", error);
    }
}