"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  useCreateInstructorModuleMutation,
  useUpdateInstructorModuleMutation,
  type InstructorModule,
  type InstructorCourse,
} from "@/redux/api/instructorApi";

interface ModuleFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  courseId: string;
  batchId: string;
  batches: InstructorCourse["batches"];
  onBatchChange: (batchId: string) => void;
  data?: InstructorModule;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModuleFormDialog({
  open, mode, courseId, batchId, batches, onBatchChange, data, onClose, onSuccess,
}: ModuleFormDialogProps) {
  const [create, { isLoading: creating }] = useCreateInstructorModuleMutation();
  const [update, { isLoading: updating }] = useUpdateInstructorModuleMutation();
  const [form, setForm] = useState({
    title: data?.title || "",
    description: data?.description || "",
    estimatedDuration: data?.estimatedDuration || "",
    status: data?.status || "draft",
    learningObjectives: data?.learningObjectives?.join("\n") || "",
  });

  const currentBatchId = data?.batchId || batchId;
  const currentBatch = batches.find((batch) => batch._id === currentBatchId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, learningObjectives: form.learningObjectives.split("\n").filter(Boolean), status: form.status as InstructorModule['status'] };
    try {
      if (mode === "create") {
        await create({ courseId, batchId: currentBatchId, ...payload }).unwrap();
        toast.success("Module created");
      } else {
        await update({ moduleId: data!._id, ...payload }).unwrap();
        toast.success("Module updated");
      }
      onSuccess();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Module" : "Edit Module"}</DialogTitle>
          <DialogDescription>{mode === "create" ? "Create a new module." : "Update module details."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Batch *</Label>
            {mode === "create" ? (
              <Select value={currentBatchId} onValueChange={onBatchChange}>
                <SelectTrigger><SelectValue placeholder="Select a batch" /></SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch._id} value={batch._id}>
                      {batch.title} - {batch.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input value={currentBatch ? `${currentBatch.title} · #${currentBatch.batchNumber} · ${currentBatch.status}` : ""} disabled />
            )}
          </div>
          <div>
            <Label>Title *</Label>
            <Input value={form.title} placeholder="Enter title of the module..." onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea value={form.description} placeholder="Enter description..." onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Estimated Duration *</Label>
              <Input value={form.estimatedDuration} onChange={e => setForm({ ...form, estimatedDuration: e.target.value })} placeholder="2 weeks" required />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: string) => setForm({ ...form, status: v as 'draft' | 'published' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Learning Objectives (one per line)</Label>
            <Textarea value={form.learningObjectives} placeholder="E.g.- Understand basic concepts\n- Apply knowledge in projects" onChange={e => setForm({ ...form, learningObjectives: e.target.value })} rows={4} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={creating || updating}>
              {(creating || updating) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
