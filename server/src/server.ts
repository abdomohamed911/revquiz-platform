import "tsconfig-paths/register"; // Add this at the top

import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import facultyRouter from "./modules/Faculty/routes";
import dbConnection from "./common/config/database.config";
import globalError from "./common/middleware/globalError";
import ApiError from "./common/utils/api/ApiError";
import courseRouter from "./modules/Course/routes";
import quizRouter from "./modules/Quiz/routes";
import questionRouter from "./modules/Question/routes";
import { authRouter } from "./modules/User/routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
dbConnection.connect();

app.use("/faculties", facultyRouter);
app.use("/courses", courseRouter);
app.use("/quizzes", quizRouter);
app.use("/questions", questionRouter);
app.use("/auth", authRouter);
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError("Route not found", "NOT_FOUND"));
});
app.use(globalError);
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
app.use("/faculties", facultyRouter);
process.on("unhandledRejection", (err: Error) => {
  console.error(`Internal Server Error: ${err.name} | ${err.message}`);
  console.error("shutting down...");
  server.close(() => process.exit(1));
});
