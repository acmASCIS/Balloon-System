import CodeforcesClient from "@acm-ascis/codeforces-client";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./controller/controller.submissions";

dotenv.config();

const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI || "";

const app = express();

// MongoDB Connection
async function connectDB() {
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in the .env file.");
        }

        await mongoose.connect(MONGO_URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        } as mongoose.ConnectOptions);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
}

// Connect to the database before starting the server
connectDB().then(() => {
    app.use("/", router);

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});