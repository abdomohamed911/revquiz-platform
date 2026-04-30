import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import ApiError from "@/common/utils/api/ApiError";
import { adminMiddleware } from "@/common/middleware/auth/admin";
import { authMiddleware } from "@/common/middleware/auth";

// Mock the User model
jest.mock("@/modules/User/model", () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

import { UserModel } from "@/modules/User/model";
import jwt from "jsonwebtoken";

const mockedUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe("adminMiddleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { user: { role: "admin" } };
    res = {};
    next = jest.fn();
  });

  it("calls next() for admin users", () => {
    adminMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("returns 403 for non-admin users", () => {
    req.user = { role: "user" };
    adminMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Admin access required",
      })
    );
  });

  it("returns 403 when user is undefined", () => {
    req.user = undefined;
    adminMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Admin access required",
      })
    );
  });
});

describe("authMiddleware", () => {
  const mockUser = {
    _id: "user123",
    email: "test@test.com",
    role: "user",
    password: "hashed",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls next() with valid token and existing user", async () => {
    mockedJwt.verify.mockReturnValue({ id: "user123" } as any);
    mockedUserModel.findById.mockResolvedValue(mockUser as any);

    const req: any = {
      headers: { authorization: "Bearer valid-token" },
    };
    const res: any = {};
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(mockedJwt.verify).toHaveBeenCalledWith(
      "valid-token",
      undefined
    );
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalledWith();
  });

  it("returns 401 when no authorization header", async () => {
    const req: any = { headers: {} };
    const res: any = {};
    const next = jest.fn();

    // The middleware will throw ApiError("No token provided") inside the try/catch
    await authMiddleware(req, res, next);
    // The catch block catches and sends "Invalid or expired token"
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("token") })
    );
  });

  it("returns 401 when authorization header does not start with Bearer", async () => {
    const req: any = { headers: { authorization: "Token invalid" } };
    const res: any = {};
    const next = jest.fn();

    await authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("token") })
    );
  });

  it("returns 401 when user is not found in DB", async () => {
    mockedJwt.verify.mockReturnValue({ id: "nonexistent" } as any);
    mockedUserModel.findById.mockResolvedValue(null);

    const req: any = {
      headers: { authorization: "Bearer some-token" },
    };
    const res: any = {};
    const next = jest.fn();

    await authMiddleware(req, res, next);
    // The catch block in the middleware catches any ApiError and wraps it
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("token") })
    );
  });

  it("returns 401 when token verification fails", async () => {
    mockedJwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const req: any = {
      headers: { authorization: "Bearer bad-token" },
    };
    const res: any = {};
    const next = jest.fn();

    await authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid or expired token" })
    );
  });
});
