import { Router } from "express";
import { courseController as c } from "./controller";
const courseRouter = Router();

courseRouter
  .route("/")
  .get(c.getAll.validator, c.getAll.handler)
  .post(c.create.validator, c.create.handler);

  courseRouter
    .route("/:id")
    .get(c.getOne.validator, c.getOne.handler)
    .put(c.update.validator, c.update.handler)
    .delete(c.deleteOne.validator, c.deleteOne.handler);

export default courseRouter;
