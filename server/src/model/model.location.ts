import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
});

export const Location = mongoose.model("Location", LocationSchema);