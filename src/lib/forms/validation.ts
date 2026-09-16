import { z } from "zod";

export function requiredString(label: string) {
  return z.string().min(1, `${label} is required`);
}

export function optionalString() {
  return z.string().optional().default("");
}

export function emailField() {
  return z.string().email("Please enter a valid email address");
}

export function passwordField(min = 6) {
  return z.string().min(min, `Password must be at least ${min} characters`);
}

export function phoneField() {
  return z
    .string()
    .optional()
    .default("");
}

export function urlField() {
  return z.string().url("Please enter a valid URL").optional().or(z.literal(""));
}

export function dateField() {
  return z.string().min(1, "Date is required");
}

export function optionalDateField() {
  return z.string().optional().default("");
}

export function imageUrlField() {
  return z.string().url("Valid image URL required").optional().or(z.literal(""));
}

export function numericField(label: string) {
  return z.coerce.number().min(0, `${label} must be positive`);
}

export function optionalNumericField() {
  return z.coerce.number().min(0).optional();
}

export function enumField<T extends readonly string[]>(values: T, label: string) {
  return z.enum(values as unknown as [string, ...string[]], {
    errorMap: () => ({ message: `Please select a ${label}` }),
  });
}

export function booleanField() {
  return z.boolean().optional().default(false);
}

export function tagsField() {
  return z
    .string()
    .transform((val) =>
      val
        .split(/,|\n/)
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .optional()
    .default("");
}

export function linesField() {
  return z
    .string()
    .transform((val) =>
      val
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .optional()
    .default("");
}

export function confirmPasswordField() {
  return z.string().min(1, "Password confirmation is required");
}

export function passwordsMustMatch() {
  return z
    .object({
      password: z.string(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
}

export function dateRange() {
  return z
    .object({
      from: z.string().min(1, "Start date is required"),
      to: z.string().min(1, "End date is required"),
    })
    .refine(
      (data) => !data.from || !data.to || new Date(data.to) >= new Date(data.from),
      { message: "End date must be on or after start date", path: ["to"] },
    );
}

export function createFormDefaults<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
): z.infer<T> {
  const shape = schema.shape;
  const defaults: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(shape)) {
    if (value instanceof z.ZodString) {
      defaults[key] = "";
    } else if (value instanceof z.ZodNumber) {
      defaults[key] = 0;
    } else if (value instanceof z.ZodBoolean) {
      defaults[key] = false;
    } else if (value instanceof z.ZodArray) {
      defaults[key] = [];
    } else if (value instanceof z.ZodOptional) {
      defaults[key] = undefined;
    } else if (value instanceof z.ZodDefault) {
      defaults[key] = value._def.defaultValue();
    } else if (value instanceof z.ZodEnum) {
      defaults[key] = value._def.values[0] ?? "";
    } else if (value instanceof z.ZodNativeEnum) {
      const values = Object.values(value._def.values);
      defaults[key] = values[0] ?? "";
    } else {
      defaults[key] = undefined;
    }
  }

  return defaults as z.infer<T>;
}
