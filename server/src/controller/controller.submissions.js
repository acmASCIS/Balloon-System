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
const config_1 = __importDefault(require("../config"));
const model_contestant_1 = require("../model/model.contestant"); // Import the Contestant model
const location_1 = require("../constants/location");
let router = express_1.default.Router();
router.get("/submissions/:contestId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let contestId = req.params.contestId;
        let locationParam = req.query.location;
        if (!contestId) {
            throw new Error("Contest ID is required");
        }
        if (locationParam && locationParam !== location_1.FAHMY && locationParam !== location_1.SAEED) {
            throw new Error("Invalid location");
        }
        let codeforcesResponse = yield config_1.default.contest.status({ contestId });
        // filter the submissions by the accepted submissions
        codeforcesResponse.result = codeforcesResponse.result.filter((submission) => submission.verdict === "OK");
        // make the submissions unique by {problem index, handle} so there will be no duplicate submissions from the same
        // handle for the same problem index
        codeforcesResponse.result = codeforcesResponse.result.filter((submission, index, self) => index === self.findIndex((s) => (s.author.members[0].handle === submission.author.members[0].handle && s.problem.index === submission.problem.index)));
        //for testing purposes
        // const locationContestants = await Contestant.find({ location: "Fahmy Tolba" });
        const locationContestants = yield model_contestant_1.Contestant.find({ location: locationParam });
        // filter contestants by thier location 
        codeforcesResponse.result = codeforcesResponse.result.filter((submission) => {
            const handle = submission.author.members[0].handle;
            return locationContestants.some(contestant => contestant.handle === handle);
        });
        // get the seat and delivered for all handles and their problems AND THEIR LOCATION
        let convertedSubmissions = codeforcesResponse.result.map((submission) => {
            const handle = submission.author.members[0].handle;
            const problemIndex = submission.problem.index;
            const contestant = locationContestants.find(contestant => contestant.handle === handle);
            return {
                id: submission.id,
                handle: handle,
                problem_index: problemIndex,
                seat: contestant ? contestant.seat : 'unknown seat',
                delivered: contestant ? contestant.delivered_problems.includes(problemIndex) : false // Check if delivered from the database
            };
        });
        let response = {
            statusCode: 200,
            message: "Submissions fetched successfully",
            data: convertedSubmissions
        };
        res.status(200).json(response);
    }
    catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message,
            data: null
        });
    }
}));
router.post("/deliver", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { handle, problem_index } = req.body;
    if (!handle || !problem_index) {
        res.status(400).json({
            statusCode: 400,
            message: "Handle and problem index are required",
            data: null
        });
        return;
    }
    try {
        // Update the delivered status in the database
        yield model_contestant_1.Contestant.updateOne({ handle }, { $addToSet: { delivered_problems: problem_index } });
        res.status(200).json({
            statusCode: 200,
            message: "Submission delivered successfully",
            data: null
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            message: error.message,
            data: null
        });
    }
}));
router.post("/undeliver", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { handle, problem_index } = req.body;
    if (!handle || !problem_index) {
        res.status(400).json({
            statusCode: 400,
            message: "Handle and problem index are required",
            data: null
        });
        return;
    }
    try {
        // Update the delivered status in the database
        yield model_contestant_1.Contestant.updateOne({ handle }, { $pull: { delivered_problems: problem_index } });
        res.status(200).json({
            statusCode: 200,
            message: "Submission delivered successfully",
            data: null
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            message: error.message,
            data: null
        });
    }
}));
exports.default = router;
