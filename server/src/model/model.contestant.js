"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contestant = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ContestantSchema = new mongoose_1.default.Schema({
    handle: { type: String, required: true },
    delivered_problems: { type: [String], default: [] },
    seat: { type: String, required: true },
    location: { type: String, required: true }
});
exports.Contestant = mongoose_1.default.model("Contestants", ContestantSchema);
