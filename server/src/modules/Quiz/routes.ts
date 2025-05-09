import { Router } from "express";
import { quizController as c } from "./controller";
const quizRouter = Router();

quizRouter
  .route("/")
  .get(c.getAll.validator, c.getAll.handler)
  .post(c.create.validator, c.create.handler);

  quizRouter
    .route("/:id")
    .get(c.getOne.validator, c.getOne.handler)
    .put(c.update.validator, c.update.handler)
    .delete(c.deleteOne.validator, c.deleteOne.handler);

export default quizRouter;
