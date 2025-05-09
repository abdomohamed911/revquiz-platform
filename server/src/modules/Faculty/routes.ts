import { Router } from "express";
import { facultyController as c } from "./controller";
const facultyRouter = Router();

facultyRouter
  .route("/")
  .get(c.getAll.validator, c.getAll.handler)
  .post( c.create.validator, c.create.handler);

facultyRouter
  .route("/:id")
  .get(c.getOne.validator, c.getOne.handler)
  .put( c.update.validator, c.update.handler)
  .delete(c.deleteOne.validator, c.deleteOne.handler);

export default facultyRouter;
