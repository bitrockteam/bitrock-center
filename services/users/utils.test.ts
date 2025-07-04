import { getFirstnameAndLastname, formatDisplayName } from "./utils";

describe("getFirstnameAndLastname", () => {
  it("should return empty strings when name is not provided", () => {
    const result = getFirstnameAndLastname();
    expect(result).toEqual({ firstName: "", lastName: "" });
  });

  it("should split the name and return the first and last name", () => {
    const result = getFirstnameAndLastname("John Doe");
    expect(result).toEqual({ firstName: "John", lastName: "Doe" });
  });

  it("should handle extra spaces in the name", () => {
    const result = getFirstnameAndLastname("   John    Doe   ");
    expect(result).toEqual({ firstName: "John", lastName: "Doe" });
  });
});

describe("formatDisplayName", () => {
  it("should return the formatted display name without initials", () => {
    const result = formatDisplayName({ name: "John Doe" });
    expect(result).toBe("John Doe");
  });

  it("should return the formatted display name with initials", () => {
    const result = formatDisplayName({ name: "John Doe", initials: true });
    expect(result).toBe("JD");
  });
});
