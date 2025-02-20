import express, { Request, Response } from "express";
import { ApiResponse } from "../api.response";
import codeforcesClient from "../config";
import { Submission } from "../model/model.submission";
import { Contestant } from "../model/model.contestant"; // Import the Contestant model
import { FAHMY, SAEED } from "../constants/location";

let router = express.Router();

router.get("/submissions/:contestId", async (req: Request, res: Response) => {
    try {
        let contestId = req.params.contestId;
        let locationParam = req.query.location;
        
        if(!contestId) {
            throw new Error("Contest ID is required");
        }

        if(locationParam && locationParam !== FAHMY && locationParam !== SAEED) {
            throw new Error("Invalid location");
        }
        
        let codeforcesResponse: any = await codeforcesClient.contest.status({ contestId });
        
        // filter the submissions by the accepted submissions
        codeforcesResponse.result = codeforcesResponse.result.filter((submission) => submission.verdict === "OK");
        
        // make the submissions unique by {problem index, handle} so there will be no duplicate submissions from the same
        // handle for the same problem index
        codeforcesResponse.result = codeforcesResponse.result.filter((submission, index, self) => 
            index === self.findIndex((s) => (
                s.author.members[0].handle === submission.author.members[0].handle && s.problem.index === submission.problem.index
            ))
        );

        
        //for testing purposes
        // const locationContestants = await Contestant.find({ location: "Fahmy Tolba" });


        const locationContestants = await Contestant.find({ location: locationParam });
        

        // filter contestants by thier location 
        codeforcesResponse.result = codeforcesResponse.result.filter((submission) => {
            const handle = submission.author.members[0].handle;
            return locationContestants.some(contestant => contestant.handle === handle);
        });

        // get the seat and delivered for all handles and their problems AND THEIR LOCATION
        let convertedSubmissions: Submission[] = codeforcesResponse.result.map((submission) => {
            const handle = submission.author.members[0].handle;
            const problemIndex = submission.problem.index;
            const contestant = locationContestants.find(contestant => contestant.handle === handle);
            return {
                id: submission.id,
                handle: handle,
                problem_index: problemIndex,
                seat: contestant ? contestant.seat : 'unknown seat', // Get the seat of the handle from the database
                delivered: contestant ? contestant.delivered_problems.includes(problemIndex) : false // Check if delivered from the database
            };
        });

        let response: ApiResponse<any> = {
            statusCode: 200,
            message: "Submissions fetched successfully",
            data: convertedSubmissions
        };
        res.status(200).json(response);
    } 
    catch(e: any) {
        res.status(500).json({
            statusCode: 500,
            message: e.message,
            data: null
        });
    }
});

router.post("/deliver", async (req: Request, res: Response) => {
    
    let { handle, problem_index } = req.body;
    if(!handle || !problem_index) {
        res.status(400).json({
            statusCode: 400,
            message: "Handle and problem index are required",
            data: null
        });
        return;
    }

    try {
        // Update the delivered status in the database
        await Contestant.updateOne(
            { handle },
            { $addToSet: { delivered_problems: problem_index } }
        );

        res.status(200).json({
            statusCode: 200,
            message: "Submission delivered successfully",
            data: null
        });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            statusCode: 500,
            message: error.message,
            data: null
        });
    }
});




router.post("/undeliver", async (req: Request, res: Response) => {
    
    let { handle, problem_index } = req.body;
    if(!handle || !problem_index) {
        res.status(400).json({
            statusCode: 400,
            message: "Handle and problem index are required",
            data: null
        });
        return;
    }

    try {
        // Update the delivered status in the database
        await Contestant.updateOne(
            { handle },
            { $pull: { delivered_problems: problem_index } }
        );

        res.status(200).json({
            statusCode: 200,
            message: "Submission delivered successfully",
            data: null
        });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            statusCode: 500,
            message: error.message,
            data: null
        });
    }
});
export default router;