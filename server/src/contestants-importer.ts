import * as dotenv from "dotenv";
import mongoose from "mongoose";
import * as xlsx from "xlsx";
import { Contestant } from "./model/model.contestant"; // Update the import statement
import { Location } from "./model/model.location"; // Add Location import

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
const workbook = xlsx.readFile("Level 1 contest.xlsx"); // Change filename if needed


// Process all sheets
const allContestants: any[] = [];

async function processSheets() {
    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const data: any[] = xlsx.utils.sheet_to_json(sheet);

        for (const row of data) {
            const hallName = row["Hall"];
            const sequenceNumber = row["Sequence Number"] - 1; // Convert to 0-based for calculation
            
            let locationDoc = await Location.findOne({ name: hallName });
            if (!locationDoc) {
                locationDoc = new Location({ name: hallName });
                await locationDoc.save();
                console.log(`Created new location: ${hallName}`);
            }

            let seat = row["Sequence Number"].toString();
            
            // If location is Hall1, calculate bench and position from sequence number
            if (hallName === "Hall 1") {
                const bench = Math.floor(sequenceNumber / 5) + 1;
                const position = (sequenceNumber % 5) + 1;
                seat = `${bench}, ${position}`;
            }

            const contestant = {
                handle: row["Codeforces Handle"],
                delivered_problems: [],
                seat: seat,
                location: locationDoc._id
            };

            allContestants.push(contestant);
        }
    }
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
(async () => {
    await connectDB();
    await processSheets();
    await saveData();
})();
