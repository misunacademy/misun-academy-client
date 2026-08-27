import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function splitLines(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function splitTags(value: string) {
  return value
    .split(/,|\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
