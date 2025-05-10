import ApiError from "@/common/utils/api/ApiError";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import expressAsyncHandler from "express-async-handler";
import { UserModel } from "./model";
import { body } from "express-validator";
import validatorMiddleware from "@/common/middleware/validators/validator";
import jwt from "jsonwebtoken";

export const authController = {
  signup: {
    handler: expressAsyncHandler(async (req, res, next) => {
      try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
          return next(new ApiError("Email is already in use", "CONFLICT"));
        }

        // Create new user
        const user = await UserModel.create({ email, password });

        // Generate JWT token
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET!,
          {
            expiresIn: "1h", // Token expires in 1 hour
          }
        );

        // Send success response with token
        res.status(201).json(
          new ApiSuccess("OK", "User registered successfully", {
            userId: user._id,
            token,
          })
        );
      } catch (error) {
        next(error);
      }
    }),
    validator: [
      body("email")
        .exists()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),
      body("password").exists().withMessage("Password is required"),
      validatorMiddleware,
    ],
  },
  login: {
    handler: expressAsyncHandler(async (req, res, next) => {
      try {
        const { email, password } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
          return next(
            new ApiError("Invalid email or password", "UNAUTHORIZED")
          );
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return next(
            new ApiError("Invalid email or password", "UNAUTHORIZED")
          );
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET!,
          {
            expiresIn: "1h", // Token expires in 1 hour
          }
        );

        // Send success response with token
        res.status(200).json(
          new ApiSuccess("OK", "User logged in successfully", {
            userId: user._id,
            token,
          })
        );
      } catch (error) {
        next(error);
      }
    }),
    validator: [
      body("email")
        .exists()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),
      body("password").exists().withMessage("Password is required"),
      validatorMiddleware,
    ],
  },
};
