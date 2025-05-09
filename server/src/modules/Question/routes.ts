import { Router } from "express";
import { questionController as c } from "./controller";
const questionRouter = Router();

questionRouter
  .route("/")
  .get(c.getAll.validator, c.getAll.handler)
  .post(c.create.validator, c.create.handler);

  questionRouter
    .route("/:id")
    .get(c.getOne.validator, c.getOne.handler)
    .put(c.update.validator, c.update.handler)
    .delete(c.deleteOne.validator, c.deleteOne.handler);
questionRouter.get(
  "/:id/solve",
  c.solveQuestion.validator,
  c.solveQuestion.handler
);
export default questionRouter;
