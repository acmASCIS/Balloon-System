import CodeforcesClient from "@acm-ascis/codeforces-client";
import dotenv from "dotenv";

dotenv.config();


const KEY = process.env.CODEFORCES_KEY;
const SECRET = process.env.CODEFORCES_SECRET;

let codeforcesClient: CodeforcesClient;

try {
  codeforcesClient = new CodeforcesClient(KEY, SECRET);
  console.log("Codeforces client initialized successfully");
} 
catch(e: any) {
  console.error(e.message);
  console.log("Error initializing codeforces client");
  process.exit(1);
}

export default codeforcesClient;