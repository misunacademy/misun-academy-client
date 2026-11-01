import { describe, it, expect } from "vitest";
import { extractApiData, getApiErrorMessage } from "@/lib/api-helpers";

describe("extractApiData", () => {
  it("unwraps { data } envelopes", () => {
    expect(extractApiData<{ a: number }>({ data: { a: 1 } })).toEqual({ a: 1 });
  });

  it("returns the payload itself when there is no envelope", () => {
    expect(extractApiData<number[]>([1, 2])).toEqual([1, 2]);
    expect(extractApiData<string>("x")).toBe("x");
  });

  it("returns undefined for nullish payloads", () => {
    expect(extractApiData(null)).toBeUndefined();
    expect(extractApiData(undefined)).toBeUndefined();
  });

  it("passes an envelope with undefined data through as-is", () => {
    expect(extractApiData({ data: undefined })).toEqual({ data: undefined });
  });
});

describe("getApiErrorMessage", () => {
  it("prefers data.message, then error, then message", () => {
    expect(getApiErrorMessage({ data: { message: "from-data" } }, "fb")).toBe("from-data");
    expect(getApiErrorMessage({ error: "from-error" }, "fb")).toBe("from-error");
    expect(getApiErrorMessage({ message: "from-message" }, "fb")).toBe("from-message");
  });

  it("falls back for unknown shapes", () => {
    expect(getApiErrorMessage({}, "fb")).toBe("fb");
    expect(getApiErrorMessage(null, "fb")).toBe("fb");
    expect(getApiErrorMessage("oops", "fb")).toBe("fb");
  });
});
