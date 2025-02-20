export interface Submission {
    id: number; // unique id for the submission (monotonically increasing)
    handle: string; // unique codeforces handle
    problem_index: string; // A, B, C, C1, etc..
    seat: string; // description inside the location (e.g: 1,3 in Fahmy Hall)
    delivered: boolean; // whether the submission was delivered or not
}

