import { filterExcludedKeys } from "@/common/utils/filterExcludedKeys";

describe("filterExcludedKeys", () => {
  it("filters out specified keys from an object", () => {
    const data = { name: "Test", email: "test@test.com", password: "secret" };
    const result = filterExcludedKeys(data, ["password"]);
    expect(result).toEqual({ name: "Test", email: "test@test.com" });
    expect(result).not.toHaveProperty("password");
  });

  it("returns a new object without modifying the original", () => {
    const data = { name: "Test", password: "secret" };
    const result = filterExcludedKeys(data, ["password"]);
    expect(data).toHaveProperty("password");
    expect(result).not.toHaveProperty("password");
  });

  it("returns all keys when exclude list is empty", () => {
    const data = { name: "Test", email: "test@test.com" };
    const result = filterExcludedKeys(data, []);
    expect(result).toEqual(data);
  });

  it("filters multiple keys", () => {
    const data = { name: "Test", email: "test@test.com", password: "secret", role: "admin" };
    const result = filterExcludedKeys(data, ["password", "role"]);
    expect(result).toEqual({ name: "Test", email: "test@test.com" });
  });

  it("handles non-existent exclude keys gracefully", () => {
    const data = { name: "Test" };
    const result = filterExcludedKeys(data, ["nonexistent"]);
    expect(result).toEqual({ name: "Test" });
  });
});
