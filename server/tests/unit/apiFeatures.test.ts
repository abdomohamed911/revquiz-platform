import mongoose from "mongoose";
import { ApiFeatures } from "@/common/utils/api/ApiFeatures";
import ApiError from "@/common/utils/api/ApiError";
import ApiSuccess from "@/common/utils/api/ApiSuccess";

describe("ApiFeatures", () => {
  describe("constructor", () => {
    it("initializes with default pagination values", () => {
      const query = { find: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, {});
      expect(features.pagination.currentPage).toBe(1);
      expect(features.pagination.limit).toBe(20);
      expect(features.pagination.totalPages).toBe(0);
    });
  });

  describe("filter", () => {
    it("ignores reserved keys", () => {
      const query = { find: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, {
        sort: "name",
        page: "2",
        keywords: "test",
      });
      const result = features.filter();
      expect(result).toBe(features);
    });

    it("passes non-reserved keys as filters", () => {
      const query = { find: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, {
        faculty: "123",
        difficulty: "easy",
      });
      features.filter();
      expect(query.find).toHaveBeenCalledWith({
        faculty: "123",
        difficulty: "easy",
      });
    });

    it("handles bracket notation for operators", () => {
      const query = { find: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, {
        "price[gte]": "10",
      });
      features.filter();
      expect(query.find).toHaveBeenCalledWith({
        price: { $gte: "10" },
      });
    });
  });

  describe("sort", () => {
    it("sorts by provided field", () => {
      const query = { sort: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, { sort: "name" });
      features.sort();
      expect(query.sort).toHaveBeenCalledWith("name");
    });

    it("defaults to -createdAt when no sort provided", () => {
      const query = { sort: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, {});
      features.sort();
      expect(query.sort).toHaveBeenCalledWith("-createdAt");
    });
  });

  describe("paginate", () => {
    it("calculates pagination correctly", () => {
      const query = { skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, { page: "2", limit: "10" });
      features.paginate(50);
      expect(query.skip).toHaveBeenCalledWith(10);
      expect(query.limit).toHaveBeenCalledWith(10);
      expect(features.pagination.totalPages).toBe(5);
    });

    it("uses defaults when no page/limit provided", () => {
      const query = { skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, {});
      features.paginate(100);
      expect(query.skip).toHaveBeenCalledWith(0);
      expect(query.limit).toHaveBeenCalledWith(20);
      expect(features.pagination.totalPages).toBe(5);
    });
  });

  describe("search", () => {
    it("searches by name field", () => {
      const query = { find: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, { keywords: "math" });
      features.search();
      expect(query.find).toHaveBeenCalledWith({
        $or: [{ name: { $regex: "math", $options: "i" } }],
      });
    });

    it("skips search when no keywords", () => {
      const query = { find: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, {});
      features.search();
      expect(query.find).not.toHaveBeenCalled();
    });
  });
});

describe("ApiError", () => {
  it("creates error with message and status code", () => {
    const error = new ApiError("Not found", "NOT_FOUND");
    expect(error.message).toBe("Not found");
    expect(error.response.statusCode).toBe(404);
  });

  it("send method returns correct JSON response", () => {
    const error = new ApiError("Bad request", "BAD_REQUEST");
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    error.send(mockRes as any);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        status: "fail",
      })
    );
  });
});

describe("ApiSuccess", () => {
  it("creates success with data", () => {
    const success = new ApiSuccess("OK", "Created", { id: "123" });
    expect(success.response.message).toBe("Created");
    expect(success.data).toEqual({ id: "123" });
  });

  it("send method returns correct JSON response", () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    ApiSuccess.send(mockRes as any, "OK", "Found", { name: "test" });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalled();
    // Verify json was called with an object containing response and data
    const jsonArg = mockRes.json.mock.calls[0][0];
    expect(jsonArg.response.statusCode).toBe(200);
    expect(jsonArg.data).toEqual({ name: "test" });
  });
});
