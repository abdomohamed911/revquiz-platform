import { Router } from "express";
import { questionController as c } from "./controller";
import { authMiddleware } from "@/common/middleware/auth";
import { adminMiddleware } from "@/common/middleware/auth/admin";

const questionRouter = Router();

questionRouter
  .route("/")
  .get(authMiddleware, c.getAll.validator, c.getAll.handler)
  .post(authMiddleware, adminMiddleware, c.create.validator, c.create.handler);

questionRouter
  .route("/:id")
  .get(authMiddleware, c.getOne.validator, c.getOne.handler)
  .put(authMiddleware, adminMiddleware, c.update.validator, c.update.handler)
  .delete(
    authMiddleware,
    adminMiddleware,
    c.deleteOne.validator,
    c.deleteOne.handler
  );

questionRouter.post(
  "/:id/solve",
  authMiddleware, // Protect this route
  c.solveQuestion.validator,
  c.solveQuestion.handler
);
questionRouter.post(
  "/quiz/:quizId/solve",
  authMiddleware, // Protect this route
  c.solveAllQuestions.validator,
  c.solveAllQuestions.handler
);
export default questionRouter;
