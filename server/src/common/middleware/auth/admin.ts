import { Request, Response, NextFunction } from "express";
import ApiError from "@/common/utils/api/ApiError";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new ApiError("Admin access required", "FORBIDDEN"));
  }
  next();
};
