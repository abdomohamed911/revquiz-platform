import ApiSuccess from "@/common/utils/api/ApiSuccess";
import ApiResponse from "@/common/utils/api/ApiResponse";

describe("ApiResponse", () => {
  it("sets statusCode and determines success status", () => {
    const response = new ApiResponse(200, "OK", "Success message");
    expect(response.statusCode).toBe(200);
    expect(response.statusMessage).toBe("OK");
    expect(response.message).toBe("Success message");
    expect(response.status).toBe("success");
    expect(response.timestamp).toBeDefined();
  });

  it("determines fail status for 4xx codes", () => {
    const response = new ApiResponse(400, "Bad Request", "Validation failed");
    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("fail");
  });

  it("determines error status for 5xx codes", () => {
    const response = new ApiResponse(500, "Server Error", "Internal error");
    expect(response.statusCode).toBe(500);
    expect(response.status).toBe("error");
  });

  it("determines success status for 201 code", () => {
    const response = new ApiResponse(201, "Created", "Resource created");
    expect(response.status).toBe("success");
  });

  it("determines success status for 204 code", () => {
    const response = new ApiResponse(204, "No Content", "");
    expect(response.status).toBe("success");
  });
});

describe("ApiSuccess", () => {
  it("stores data and message correctly", () => {
    const success = new ApiSuccess("OK", "Found", { id: "123", name: "test" });
    expect(success.data).toEqual({ id: "123", name: "test" });
    expect(success.response.message).toBe("Found");
  });

  it("creates response with CREATED status", () => {
    const success = new ApiSuccess("CREATED", "Document created", { id: "456" });
    expect(success.response.statusCode).toBe(201);
  });

  it("handles null data", () => {
    const success = new ApiSuccess("NO_CONTENT", "Deleted", null);
    expect(success.data).toBeNull();
  });
});
