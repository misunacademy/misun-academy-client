const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type DateInputBoundary = "start" | "end";

/**
 * Date inputs represent a calendar day in the user's local timezone, not UTC.
 * Keep the selected day intact and make end dates inclusive through the end
 * of that day.
 */
export function dateInputToDate(value: string, boundary: DateInputBoundary = "start"): Date {
  const [year, month, day] = value.split("-").map(Number);
  return boundary === "end"
    ? new Date(year, month - 1, day, 23, 59, 59, 999)
    : new Date(year, month - 1, day, 0, 0, 0, 0);
}

export function dateToInputValue(value: Date | string | number): string {
  if (typeof value === "string" && DATE_INPUT_PATTERN.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}
