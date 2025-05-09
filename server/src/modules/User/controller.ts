import baseController from "@/common/controllers/handlers";
import { UserModel } from "./model";
import ApiError from "@/common/utils/api/ApiError";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import expressAsyncHandler from "express-async-handler";

export const userController = {
  ...baseController(UserModel),
  getProfile: {
    handler: expressAsyncHandler(async (req, res, next) => {
      try {
        const user = req.user; // Authenticated user
        if (!user) {
          return next(new ApiError("Unauthorized access", "UNAUTHORIZED"));
        }

        const userData = await UserModel.findById(user._id).select("-password");
        if (!userData) {
          return next(new ApiError("User not found", "NOT_FOUND"));
        }

        res
          .status(200)
          .json(
            new ApiSuccess("OK", "User profile fetched successfully", userData)
          );
      } catch (error) {
        next(error);
      }
    }),
  },
};