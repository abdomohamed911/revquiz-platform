import { Router } from "express";
import { facultyController as c } from "./controller";
import { authMiddleware } from "@/common/middleware/auth";
import { adminMiddleware } from "@/common/middleware/auth/admin";
const facultyRouter = Router();

facultyRouter
  .route("/")
  .get(c.getAll.validator, c.getAll.handler)
  .post(authMiddleware, adminMiddleware, c.create.validator, c.create.handler);

facultyRouter
  .route("/:id")
  .get(c.getOne.validator, c.getOne.handler)
  .put(authMiddleware, adminMiddleware, c.update.validator, c.update.handler)
  .delete(
    authMiddleware,
    adminMiddleware,
    c.deleteOne.validator,
    c.deleteOne.handler
  );

export default facultyRouter;
