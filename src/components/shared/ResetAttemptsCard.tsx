"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, RotateCcw, Search } from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { getApiErrorMessage } from "@/lib/api-helpers";

export interface ResettableStudent {
  id: string;
  name: string;
  email: string;
}

interface ResetAttemptsCardProps {
  /** Resolve a student by email (exact match). Return null when not found. */
  onLookup: (email: string) => Promise<ResettableStudent | null>;
  /** Perform the reset; resolves with the number of deleted attempts. */
  onReset: (userId: string) => Promise<number>;
  lookupLoading?: boolean;
}

/**
 * Recovery UI for learners stuck after exhausting quiz attempts without
 * ever passing: find the student by email, then reset their attempts for
 * this quiz so the next module unlocks on their next pass.
 */
export default function ResetAttemptsCard({ onLookup, onReset, lookupLoading = false }: ResetAttemptsCardProps) {
  const [email, setEmail] = useState("");
  const [matched, setMatched] = useState<ResettableStudent | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleLookup = async () => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      toast.error("Enter a student email first");
      return;
    }
    setLookingUp(true);
    setMatched(null);
    try {
      const student = await onLookup(normalized);
      if (!student) {
        toast.error("No student found for this email");
        return;
      }
      setMatched(student);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Student lookup failed"));
    } finally {
      setLookingUp(false);
    }
  };

  const handleConfirmReset = async () => {
    if (!matched) return;
    setResetting(true);
    try {
      const deleted = await onReset(matched.id);
      toast.success(`Attempts reset — ${deleted} attempt(s) removed for ${matched.name}. They can retry the quiz now.`);
      setConfirmOpen(false);
      setMatched(null);
      setEmail("");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to reset attempts"));
    } finally {
      setResetting(false);
    }
  };

  const busy = lookingUp || lookupLoading;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <RotateCcw className="h-4 w-4" />
            Reset stuck attempts
          </CardTitle>
          <CardDescription>
            A learner who uses every attempt without passing is locked out of the next content forever.
            Find them by email and reset their attempts for this quiz so they can retry.
            Reset is refused when the student already passed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-student-email">Student email</Label>
            <div className="flex gap-2">
              <Input
                id="reset-student-email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void handleLookup(); } }}
              />
              <Button variant="outline" onClick={() => { void handleLookup(); }} disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Find
              </Button>
            </div>
          </div>
          {matched && (
            <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{matched.name}</p>
                <p className="truncate text-xs text-muted-foreground">{matched.email}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => setConfirmOpen(true)}>
                Reset attempts
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Reset attempts for ${matched?.name ?? "this student"}?`}
        description="All of their attempts for this quiz will be permanently removed and they can start over. Use this only for learners stuck without a pass."
        confirmLabel="Reset Attempts"
        confirming={resetting}
        onConfirm={() => { void handleConfirmReset(); }}
      />
    </>
  );
}
