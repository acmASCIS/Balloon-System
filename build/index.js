"use strict";
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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const controller_submissions_1 = __importDefault(require("./controller/controller.submissions"));
dotenv_1.default.config();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI || "";
const app = (0, express_1.default)();
// MongoDB Connection
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
// Connect to the database before starting the server
connectDB().then(() => {
    app.use("/", controller_submissions_1.default);
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
