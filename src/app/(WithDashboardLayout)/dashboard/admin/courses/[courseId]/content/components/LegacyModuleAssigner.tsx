"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Module {
  _id: string;
  title: string;
  orderIndex: number;
}

interface Batch {
  _id: string;
  title: string;
  batchNumber: number;
  status: string;
}

interface CourseOption {
  _id: string;
  title: string;
}

interface LegacyModuleAssignerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: CourseOption[];
  legacyCourseId: string;
  onCourseChange: (courseId: string) => void;
  unassignedModules: Module[];
  unassignedLoading: boolean;
  legacyBatches: Batch[];
  onAssign: (moduleId: string, batchId: string) => Promise<void>;
  onClose: () => void;
}

export function LegacyModuleAssigner({
  open, onOpenChange, courses, legacyCourseId, onCourseChange,
  unassignedModules, unassignedLoading, legacyBatches, onAssign, onClose,
}: LegacyModuleAssignerProps) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Assign Batch to Legacy Modules</DialogTitle>
          <DialogDescription>
            Modules created before batch support can be assigned here.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Label>Course</Label>
            <Select value={legacyCourseId} onValueChange={onCourseChange}>
              <SelectTrigger className="w-[320px]">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course._id} value={course._id}>{course.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {unassignedLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : unassignedModules.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No unassigned modules for this course.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {unassignedModules.map((module) => {
                const assignedBatchId = assignments[module._id] || "";
                return (
                  <div key={module._id} className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="font-medium">{module.title}</p>
                      <p className="text-xs text-muted-foreground">Order {module.orderIndex}</p>
                    </div>
                    <div className="flex flex-1 items-center gap-2 md:justify-end">
                      <Select
                        value={assignedBatchId}
                        onValueChange={(value) => setAssignments((prev) => ({ ...prev, [module._id]: value }))}
                        disabled={legacyBatches.length === 0}
                      >
                        <SelectTrigger className="w-[240px]">
                          <SelectValue placeholder="Select batch" />
                        </SelectTrigger>
                        <SelectContent>
                          {legacyBatches.map((batch) => (
                            <SelectItem key={batch._id} value={batch._id}>
                              {batch.title} · #{batch.batchNumber} · {batch.status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        disabled={!assignedBatchId || updatingId === module._id}
                        onClick={async () => {
                          if (!assignedBatchId) return;
                          setUpdatingId(module._id);
                          try {
                            await onAssign(module._id, assignedBatchId);
                            setAssignments((prev) => {
                              const next = { ...prev };
                              delete next[module._id];
                              return next;
                            });
                          } catch {
                            // error handled upstream
                          } finally {
                            setUpdatingId(null);
                          }
                        }}
                      >
                        {updatingId === module._id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
