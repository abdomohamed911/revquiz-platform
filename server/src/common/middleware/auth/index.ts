// filepath: e:\IT\Coding\Projects\College projects\3th\WebPrograming\RevQuiz\server\src\common\middleware\auth\index.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import ApiError from "@/common/utils/api/ApiError";
import { UserModel } from "@/modules/User/model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError("No token provided", "UNAUTHORIZED");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    // Fetch the user from the database
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      throw new ApiError("User not found", "UNAUTHORIZED");
    }

    req.user = user; // Attach user to the request object
    next();
  } catch (error) {
    next(new ApiError("Invalid or expired token", "UNAUTHORIZED"));
  }
};
