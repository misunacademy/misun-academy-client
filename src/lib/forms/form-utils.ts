import type { FieldErrors } from "react-hook-form";

export function getFieldError(errors: FieldErrors, name: string): string | undefined {
  const error = name.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, errors);

  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }

  return undefined;
}

export function isFieldInvalid(errors: FieldErrors, name: string): boolean {
  return !!getFieldError(errors, name);
}

export function getFieldId(name: string): string {
  return `field-${name.replace(/\./g, "-")}`;
}

export function getErrorId(name: string): string {
  return `field-${name.replace(/\./g, "-")}-error`;
}

export function getDescriptionId(name: string): string {
  return `field-${name.replace(/\./g, "-")}-description`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
