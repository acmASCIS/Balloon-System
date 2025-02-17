import CodeforcesClient from "@acm-ascis/codeforces-client";

import express from "express";
import router from "./controller/controller.submissions";


const PORT = 3000;

const app = express();

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})