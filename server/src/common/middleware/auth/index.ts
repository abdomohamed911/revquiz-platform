import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import ApiError from "@/common/utils/api/ApiError";

export const authMiddleware = (
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!); // Ensure `JWT_SECRET` is set in `.env`
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    next(new ApiError("Invalid or expired token", "UNAUTHORIZED"));
  }
};
