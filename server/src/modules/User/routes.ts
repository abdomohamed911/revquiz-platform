import { Router } from "express";
import { userController as c } from "./controller";
import { authController as ac } from "./auth.controller";
export const authRouter = Router();
const userRouter = Router();
userRouter
  .route("/")
  .get(c.getAll.validator, c.getAll.handler)
  .post(c.create.validator, c.create.handler);

userRouter
  .route("/:id")
  .get(c.getOne.validator, c.getOne.handler)
  .put(c.update.validator, c.update.handler)
  .delete(c.deleteOne.validator, c.deleteOne.handler);
authRouter.route("/signup").post(ac.signup.validator, ac.signup.handler);
authRouter.route("/login").post(ac.login.validator, ac.login.handler);
export default userRouter;
