import express, { Request, Response } from "express";
import { ApiResponse } from "../api.response";
import codeforcesClient from "../config";
import { Submission } from "../model/model.submission";

let router = express.Router();

router.get("/submissions/:contestId", async (req: Request, res: Response) => {
    try {
        let contestId = req.params.contestId;
        let newParam = req.query.new === 'true';
        let locationParam = req.query.location;
        
        if (newParam === undefined) {
            newParam = false;
        }
        
        if(!contestId) {
            throw new Error("Contest ID is required");
        }

        if(locationParam) {
            // make sure the location is valid ==> in the enum
        }

        let codeforcesResponse = await codeforcesClient.contest.status({ contestId });


        // filter the submissions by the accepted submissions
        codeforcesResponse.result = codeforcesResponse.result.filter((submission) => submission.verdict === "OK");
        
        // make the submissions unique by {problem index, handle} so there will be no duplicate submissions from the same
        // handle for the same problem index
        codeforcesResponse.result = codeforcesResponse.result.filter((submission, index, self) => 
            index === self.findIndex((s) => (
                s.author.members[0].handle === submission.author.members[0].handle && s.problem.index === submission.problem.index
            ))
        );

        // get the seat and delivered for all handles and their problems AND THEIR LOCATION
        

        let convertedSubmissions: Submission[] = codeforcesResponse.result.map((submission) => {
            return {
                id: submission.id,
                handle: submission.author.members[0].handle,
                problem_index: submission.problem.index,
                seat: "random seat", // You need to provide logic to determine the seat
                delivered: false // Assuming new submissions are not delivered
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

router.post("/deliver", (req: Request, res: Response) => {
    let { handle, problem_index } = req.body;
    if(!handle || !problem_index) {
        res.status(400).json({
            statusCode: 400,
            message: "Handle and problem index are required",
            data: null
        });
        return;
    }
    // deliver the submission with the given handle and problem index in the database

});


export default router;