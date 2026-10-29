import { describe, expect, it } from "vitest";
import { dateInputToDate, dateToInputValue } from "./date-input";

describe("date input conversion", () => {
  it("makes an enrollment end date inclusive through 23:59:59.999", () => {
    const date = dateInputToDate("2026-10-20", "end");

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(9);
    expect(date.getDate()).toBe(20);
    expect(date.getHours()).toBe(23);
    expect(date.getMinutes()).toBe(59);
    expect(date.getSeconds()).toBe(59);
    expect(date.getMilliseconds()).toBe(999);
  });

  it("keeps a date-only value on the selected calendar day", () => {
    const date = dateInputToDate("2026-10-20");

    expect(dateToInputValue(date)).toBe("2026-10-20");
  });

  it("preserves date-only values without parsing them as UTC", () => {
    expect(dateToInputValue("2026-10-20")).toBe("2026-10-20");
  });
});
