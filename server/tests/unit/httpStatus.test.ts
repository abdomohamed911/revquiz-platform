import { HTTP_STATUS } from "@/common/constants/httpStatus";

describe("HTTP_STATUS constants", () => {
  describe("SUCCESS statuses", () => {
    it("has OK = 200", () => {
      expect(HTTP_STATUS.SUCCESS.OK).toBe(200);
    });

    it("has CREATED = 201", () => {
      expect(HTTP_STATUS.SUCCESS.CREATED).toBe(201);
    });

    it("has ACCEPTED = 202", () => {
      expect(HTTP_STATUS.SUCCESS.ACCEPTED).toBe(202);
    });

    it("has NO_CONTENT = 204", () => {
      expect(HTTP_STATUS.SUCCESS.NO_CONTENT).toBe(204);
    });
  });

  describe("ERROR statuses", () => {
    it("has BAD_REQUEST = 400", () => {
      expect(HTTP_STATUS.ERROR.BAD_REQUEST).toBe(400);
    });

    it("has UNAUTHORIZED = 401", () => {
      expect(HTTP_STATUS.ERROR.UNAUTHORIZED).toBe(401);
    });

    it("has FORBIDDEN = 403", () => {
      expect(HTTP_STATUS.ERROR.FORBIDDEN).toBe(403);
    });

    it("has NOT_FOUND = 404", () => {
      expect(HTTP_STATUS.ERROR.NOT_FOUND).toBe(404);
    });

    it("has CONFLICT = 409", () => {
      expect(HTTP_STATUS.ERROR.CONFLICT).toBe(409);
    });

    it("has INTERNAL_SERVER_ERROR = 500", () => {
      expect(HTTP_STATUS.ERROR.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });
});
