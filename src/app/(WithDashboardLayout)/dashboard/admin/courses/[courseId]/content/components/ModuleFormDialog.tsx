/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCreateCourseModuleMutation, useUpdateCourseModuleMutation } from "@/redux/api/moduleApi";
import { useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


interface Module {
  _id: string;
  courseId: string;
  batchId?: string;
  title: string;
  description: string;
  orderIndex: number;
  estimatedDuration: string;
  learningObjectives: string[];
  status: 'draft' | 'published';
  lessonCount: number;
}

interface Batch {
  _id: string;
  title: string;
  batchNumber: number;
  status: string;
}

const ModuleFormDialog=({ open, mode, data, courseId, batchId, batches, onBatchChange, onClose, onSuccess }: {
  open: boolean;
  mode: 'create' | 'edit';
  data?: Module;
  courseId: string;
  batchId: string;
  batches: Batch[];
  onBatchChange: (batchId: string) => void;
  onClose: () => void;
  onSuccess: () => void;
}) =>{
  const [createModule, { isLoading: creating }] = useCreateCourseModuleMutation();
  const [updateModule, { isLoading: updating }] = useUpdateCourseModuleMutation();

  const [formData, setFormData] = useState({
    title: data?.title || '',
    description: data?.description || '',
    estimatedDuration: data?.estimatedDuration || '',
    status: data?.status || 'draft',
    learningObjectives: data?.learningObjectives?.join('\n') || '',
  });

  const currentBatchId = data?.batchId || batchId;
  const currentBatch = batches.find((batch) => batch._id === currentBatchId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      learningObjectives: formData.learningObjectives.split('\n').filter(Boolean),
    };

    try {
      if (mode === 'create') {
        await createModule({ courseId, batchId: currentBatchId, ...payload }).unwrap();
        toast.success('Module created successfully');
      } else {
        await updateModule({ moduleId: data!._id, ...payload }).unwrap();
        toast.success('Module updated successfully');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Operation failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Module' : 'Edit Module'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new module to organize course content' : 'Update module information'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Batch *</Label>
            {mode === 'create' ? (
              <Select value={currentBatchId} onValueChange={onBatchChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch._id} value={batch._id}>
                      {batch.title} · #{batch.batchNumber} · {batch.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={currentBatch ? `${currentBatch.title} · #${currentBatch.batchNumber} · ${currentBatch.status}` : ""}
                disabled
              />
            )}
          </div>
          <div>
            <Label>Module Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Introduction to Adobe Photoshop"
              required
            />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Learn essential Photoshop tools and techniques for professional graphic design work..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Estimated Duration *</Label>
              <Input
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                placeholder="2 weeks"
                required
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Learning Objectives (one per line)</Label>
            <Textarea
              value={formData.learningObjectives}
              onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
              placeholder="Master Photoshop selection tools and layers
Create professional photo manipulations
Apply advanced masking and compositing techniques
Design graphics for web and print media"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={creating || updating}>
              {(creating || updating) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Create Module' : 'Update Module'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ModuleFormDialog;