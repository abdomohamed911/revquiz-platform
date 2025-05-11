import { Router } from "express";
import { quizController as c } from "./controller";
import { authMiddleware } from "@/common/middleware/auth";
import { adminMiddleware } from "@/common/middleware/auth/admin";
const quizRouter = Router();

quizRouter
  .route("/")
  .get(c.getAll.validator, c.getAll.handler)
  .post(authMiddleware, adminMiddleware, c.create.validator, c.create.handler);

quizRouter
  .route("/:id")
  .get(c.getOne.validator, c.getOne.handler)
  .put(authMiddleware, adminMiddleware, c.update.validator, c.update.handler)
  .delete(
    authMiddleware,
    adminMiddleware,
    c.deleteOne.validator,
    c.deleteOne.handler
  );

export default quizRouter;
