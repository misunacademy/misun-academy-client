export type Defaultable<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends Array<infer U>
        ? U[]
        : T extends object
          ? { [K in keyof T]: Defaultable<T[K]> }
          : T | undefined;

export function pickDefault<T extends Record<string, unknown>>(
  defaultValues: T,
  data?: Partial<T> | null,
): T {
  if (!data) return { ...defaultValues };
  const result = { ...defaultValues };
  for (const key of Object.keys(defaultValues)) {
    if (key in data && data[key] !== undefined && data[key] !== null) {
      (result as Record<string, unknown>)[key] = data[key];
    }
  }
  return result;
}
