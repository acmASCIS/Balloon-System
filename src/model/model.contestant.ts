import mongoose from "mongoose";

const ContestantSchema = new mongoose.Schema({
    handle: { type: String, required: true },
    delivered_problems: { type: [String], default: [] },
    seat: { type: String, required: true },
    location: { type: String, required: true }
});

export const Contestant = mongoose.model("Contestants", ContestantSchema);