"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const xlsx = __importStar(require("xlsx"));
const model_contestant_1 = require("./model/model.contestant"); // Update the import statement
dotenv.config();
// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "";
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!MONGO_URI) {
                throw new Error("MONGO_URI is not defined in the .env file.");
            }
            yield mongoose_1.default.connect(MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log("Connected to MongoDB");
        }
        catch (error) {
            console.error("DB Connection Error:", error);
            process.exit(1);
        }
    });
}
// Load Excel file
const workbook = xlsx.readFile("level1contest.xlsx"); // Change filename if needed
// Process all sheets
const allContestants = [];
for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    const contestants = data.map(row => ({
        handle: row["Codeforces Handle"],
        delivered_problems: [],
        seat: `${row["Bench (down to up)"]}, ${row["Position (right to left)"]}`,
        location: row["Hall"]
    }));
    allContestants.push(...contestants);
    break;
}
// Save data to MongoDB
function saveData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (allContestants.length === 0) {
                console.log("No data found in the Excel file.");
                return;
            }
            yield model_contestant_1.Contestant.deleteMany({});
            yield model_contestant_1.Contestant.insertMany(allContestants);
            console.log("Data imported successfully!");
        }
        catch (error) {
            console.error("Error inserting data:", error);
        }
        finally {
            mongoose_1.default.connection.close();
        }
    });
}
// Run the script
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDB();
    yield saveData();
}))();
