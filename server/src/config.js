"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const codeforces_client_1 = __importDefault(require("@acm-ascis/codeforces-client"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const KEY = process.env.CODEFORCES_KEY;
const SECRET = process.env.CODEFORCES_SECRET;
let codeforcesClient;
try {
    codeforcesClient = new codeforces_client_1.default(KEY, SECRET);
    console.log("Codeforces client initialized successfully");
}
catch (e) {
    console.error(e.message);
    console.log("Error initializing codeforces client");
    process.exit(1);
}
exports.default = codeforcesClient;
