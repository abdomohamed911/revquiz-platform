import { ApiFeatures } from "@/common/utils/api/ApiFeatures";
import { ERROR_MAPPINGS } from "@/common/constants/error.constants";
import { Error as MongooseError } from "mongoose";

describe("ApiFeatures - additional coverage", () => {
  describe("limitFields", () => {
    it("selects specified fields", () => {
      const query = { select: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, { fields: "name,email" });
      features.limitFields();
      expect(query.select).toHaveBeenCalledWith("name email");
    });

    it("excludes createdAt and __v by default", () => {
      const query = { select: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, {});
      features.limitFields();
      expect(query.select).toHaveBeenCalledWith("-createdAt -__v");
    });
  });

  describe("populate", () => {
    it("populates specified field", () => {
      const query = { populate: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, { populate: "faculty" });
      features.populate();
      expect(query.populate).toHaveBeenCalledWith("faculty");
    });

    it("skips populate when no populate param", () => {
      const query = { populate: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, {});
      features.populate();
      expect(query.populate).not.toHaveBeenCalled();
    });
  });

  describe("sort", () => {
    it("handles multi-field sort", () => {
      const query = { sort: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, { sort: "name -createdAt" });
      features.sort();
      expect(query.sort).toHaveBeenCalledWith("name -createdAt");
    });
  });

  describe("filter - edge cases", () => {
    it("ignores undefined values", () => {
      const query = { find: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, {
        faculty: undefined,
        name: "Test",
      });
      features.filter();
      expect(query.find).toHaveBeenCalledWith({ name: "Test" });
    });

    it("ignores empty string values", () => {
      const query = { find: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, {
        faculty: "",
        name: "Test",
      });
      features.filter();
      expect(query.find).toHaveBeenCalledWith({ name: "Test" });
    });

    it("handles bracket notation with non-matching pattern gracefully", () => {
      const query = { find: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, {
        "invalid-bracket": "value",
      });
      features.filter();
      expect(query.find).toHaveBeenCalledWith({
        "invalid-bracket": "value",
      });
    });
  });

  describe("paginate - edge cases", () => {
    it("handles page with leading zeros", () => {
      const query = { skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, { page: "01", limit: "10" });
      features.paginate(50);
      expect(features.pagination.currentPage).toBe(1);
    });

    it("handles zero total results", () => {
      const query = { skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, { page: "1", limit: "10" });
      features.paginate(0);
      expect(features.pagination.totalPages).toBe(0);
      expect(features.pagination.totalResults).toBe(0);
    });

    it("updates pagination on the instance", () => {
      const query = { skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis() };
      const features = new ApiFeatures(query, { page: "3", limit: "5" });
      features.paginate(100);
      expect(features.pagination.currentPage).toBe(3);
      expect(features.pagination.limit).toBe(5);
      expect(features.pagination.totalPages).toBe(20);
      expect(features.pagination.totalResults).toBe(100);
    });
  });

  describe("chaining", () => {
    it("supports method chaining", () => {
      const query: any = {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      };
      const features = new ApiFeatures(query, {
        name: "Test",
        sort: "name",
        page: "1",
        limit: "10",
        fields: "name",
        populate: "faculty",
      });

      const result = features
        .filter()
        .sort()
        .paginate(10)
        .limitFields()
        .populate();

      expect(result).toBe(features);
    });
  });
});

describe("ERROR_MAPPINGS", () => {
  it("has handlers for known error types", () => {
    expect(ERROR_MAPPINGS.ValidationError).toBeDefined();
    expect(ERROR_MAPPINGS.MongoServerError).toBeDefined();
    expect(ERROR_MAPPINGS.CastError).toBeDefined();
  });

  it("MongoServerError handler extracts keyPattern and keyValue", () => {
    const mongoError: any = new Error("Duplicate key");
    mongoError.name = "MongoServerError";
    mongoError.code = 11000;
    mongoError.keyPattern = { email: 1 };
    mongoError.keyValue = { email: "test@test.com" };

    const { handle, status } = ERROR_MAPPINGS.MongoServerError;
    const result = handle(mongoError);
    expect(status).toBe("CONFLICT");
    expect(result.message).toContain("email");
    expect(result.details[0].code).toBe("DUPLICATE_KEY");
  });

  it("CastError handler extracts path and value", () => {
    const castError = new MongooseError.CastError("ObjectId", "abc", "_id");

    const { handle, status } = ERROR_MAPPINGS.CastError;
    const result = handle(castError);
    expect(status).toBe("BAD_REQUEST");
    expect(result.details[0].field).toBe("_id");
    expect(result.details[0].code).toBe("INVALID_TYPE");
  });

  it("ValidationError handler joins all error messages", () => {
    const validationError = new MongooseError.ValidationError({});
    Object.assign(validationError, {
      errors: {
        email: { message: "Email is required", path: "email", value: "" },
        password: { message: "Password too short", path: "password", value: "ab" },
      },
    });

    const { handle, status } = ERROR_MAPPINGS.ValidationError;
    const result = handle(validationError);
    expect(status).toBe("UNPROCESSABLE_ENTITY");
    expect(result.message).toContain("Email is required");
    expect(result.message).toContain("Password too short");
    expect(result.details).toHaveLength(2);
  });
});
