import dotenv from "dotenv";
import mongoose from "mongoose";
import * as xlsx from "xlsx";

dotenv.config();

// Define MongoDB Schema
const ContestantSchema = new mongoose.Schema({
    handle: { type: String, required: true },
    delivered_problems: { type: [Number], default: [] },
    seat: { type: String, required: true },
    location: { type: String, required: true }
});

// Create Mongoose Model
const Contestant = mongoose.model("Contestants", ContestantSchema);

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
const workbook = xlsx.readFile("Level 1 contest T-T.xlsx"); // Change filename if needed

// Process all sheets
const allContestants: any[] = [];

for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    const contestants = data.map(row => ({
        handle: row["Codeforces handle"],
        delivered_problems: [],
        seat: `${row["Bench(from front to back)"]}, ${row["Position(from left to right)"]}`,
        location: row["Hall"]
    }));

    allContestants.push(...contestants);
}

// Save data to MongoDB
async function saveData() {
    try {
        if (allContestants.length === 0) {
            console.log("No data found in the Excel file.");
            return;
        }

        await Contestant.insertMany(allContestants);
        console.log("Data imported successfully!");
    } catch (error) {
        console.error("Error inserting data:", error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the script
(async () => {
    await connectDB();
    await saveData();
})();
