import globalError from "@/common/middleware/globalError";
import ApiError from "@/common/utils/api/ApiError";
import { Error as MongooseError } from "mongoose";

describe("globalError middleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("handles ApiError instances", () => {
    const err = new ApiError("Not found", "NOT_FOUND");
    globalError(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: "Not found",
      })
    );
  });

  it("handles generic errors as INTERNAL_SERVER_ERROR", () => {
    const err = new Error("Something went wrong");
    globalError(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
      })
    );
  });

  it("includes stack trace in development mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const err = new ApiError("Test error", "BAD_REQUEST");
    globalError(err, req, res, next);
    const response = res.json.mock.calls[0][0];
    expect(response.stack).toBeDefined();
    process.env.NODE_ENV = originalEnv;
  });

  it("excludes stack trace in production mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const err = new ApiError("Test error", "BAD_REQUEST");
    globalError(err, req, res, next);
    const response = res.json.mock.calls[0][0];
    expect(response.stack).toBeUndefined();
    process.env.NODE_ENV = originalEnv;
  });

  it("handles Mongoose ValidationError", () => {
    const validationError = new MongooseError.ValidationError({});
    Object.assign(validationError, {
      errors: {
        email: { message: "Email is required", path: "email", value: "" },
      },
    });
    globalError(validationError, req, res, next);
    expect(res.status).toHaveBeenCalledWith(422);
  });

  it("handles Mongoose CastError", () => {
    const castError = new MongooseError.CastError("ObjectId", "abc123", "_id");
    globalError(castError, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("handles MongoDB duplicate key error (code 11000)", () => {
    const mongoError: any = new Error("Duplicate key");
    mongoError.name = "MongoServerError";
    mongoError.code = 11000;
    mongoError.keyPattern = { email: 1 };
    mongoError.keyValue = { email: "test@test.com" };
    globalError(mongoError, req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("handles Error with code 11000 and MongoServerError name", () => {
    const mongoError: any = new Error("Duplicate key");
    mongoError.name = "MongoServerError";
    mongoError.code = 11000;
    mongoError.keyPattern = { name: 1 };
    mongoError.keyValue = { name: "Test" };
    globalError(mongoError, req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
  });
});
