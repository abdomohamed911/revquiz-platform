import validatorMiddleware from "@/common/middleware/validators/validator";

// Mock express-validator module
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

import { validationResult } from "express-validator";

describe("validatorMiddleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("calls next() when there are no validation errors", () => {
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });

    validatorMiddleware(req as any, res as any, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("calls next with ApiError when validation errors exist", () => {
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { type: "field", msg: "Email is required", path: "email", value: "" },
      ],
    });

    validatorMiddleware(req as any, res as any, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Email is required",
      })
    );
  });

  it("handles Mongoose CastError in validation", () => {
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => [
        {
          type: "field",
          msg: "Cast to ObjectId failed for value",
          path: "id",
          value: "invalid",
        },
      ],
    });

    validatorMiddleware(req as any, res as any, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Invalid ID format"),
      })
    );
  });

  it("handles multiple validation errors", () => {
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { type: "field", msg: "Email is required", path: "email", value: "" },
        { type: "field", msg: "Password is required", path: "password", value: "" },
      ],
    });

    validatorMiddleware(req as any, res as any, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({ message: "Email is required" }),
          expect.objectContaining({ message: "Password is required" }),
        ]),
      })
    );
  });
});
