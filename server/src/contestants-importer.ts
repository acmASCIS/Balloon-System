import * as dotenv from "dotenv";
import mongoose from "mongoose";
import * as xlsx from "xlsx";
import * as path from "path";
import fs from "fs";
import { Contestant } from "./model/model.contestant"; // Update the import statement

dotenv.config();

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "";

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

// Load Excel file
const folderPath = path.join(process.cwd(), "src", "data");
const files = fs.readdirSync(folderPath);

const validFile = files.find(file=>file.toLowerCase().endsWith(".xlsx"));

const filePath = path.join(folderPath, validFile);

const workbook = xlsx.readFile(filePath); // Change filename if needed

// Process all sheets
const allContestants: any[] = [];

for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    const contestants = data.map(row => ({
        handle: row["Codeforces Handle"],
        delivered_problems: [],
        seat: `${row["Bench (down to up)"]}, ${row["Position (right to left)"]}`,
        location: row["Hall"]
    }));

    allContestants.push(...contestants);
    // break; 

}

// Save data to MongoDB
async function saveData() {
    try {
        if (allContestants.length === 0) {
            console.log("No data found in the Excel file.");
            return;
        }
        await Contestant.deleteMany({});
        await Contestant.insertMany(allContestants);
        console.log("Data imported successfully!");
    } catch (error) {
        console.error("Error inserting data:", error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the script
export default async function importContestants() {
    await connectDB();
    await saveData();
}