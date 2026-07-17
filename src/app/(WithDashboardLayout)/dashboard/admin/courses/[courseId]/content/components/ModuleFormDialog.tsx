"use client"

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/forms/input-field";
import { TextareaField } from "@/components/forms/textarea-field";
import { SelectField } from "@/components/forms/select-field";
import { SubmitButton } from "@/components/forms/submit-button";
import { useCreateCourseModuleMutation, useUpdateCourseModuleMutation } from "@/redux/api/moduleApi";
import { toast } from "sonner";

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

const moduleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  estimatedDuration: z.string().min(1, "Duration is required"),
  status: z.enum(["draft", "published"]),
  learningObjectives: z.string().optional(),
});

type ModuleFormValues = z.infer<typeof moduleSchema>;

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

const ModuleFormDialog = ({ open, mode, data, courseId, batchId, batches, onBatchChange, onClose, onSuccess }: {
  open: boolean;
  mode: 'create' | 'edit';
  data?: Module;
  courseId: string;
  batchId: string;
  batches: Batch[];
  onBatchChange: (batchId: string) => void;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [createModule, { isLoading: creating }] = useCreateCourseModuleMutation();
  const [updateModule, { isLoading: updating }] = useUpdateCourseModuleMutation();

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema) as Resolver<ModuleFormValues>,
    defaultValues: {
      title: data?.title || '',
      description: data?.description || '',
      estimatedDuration: data?.estimatedDuration || '',
      status: data?.status || 'draft',
      learningObjectives: data?.learningObjectives?.join('\n') || '',
    },
  });

  const currentBatchId = data?.batchId || batchId;
  const currentBatch = batches.find((batch) => batch._id === currentBatchId);

  const handleSubmit = async (values: ModuleFormValues) => {
    const payload = {
      ...values,
      learningObjectives: values.learningObjectives ? values.learningObjectives.split('\n').filter(Boolean) : [],
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
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Operation failed');
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Batch *</label>
              {mode === 'create' ? (
                <Select value={currentBatchId} onValueChange={onBatchChange}>
                  <SelectTrigger className="mt-2">
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
                  className="mt-2"
                  value={currentBatch ? `${currentBatch.title} · #${currentBatch.batchNumber} · ${currentBatch.status}` : ""}
                  disabled
                />
              )}
            </div>

            <InputField name="title" label="Module Title" placeholder="Introduction to Adobe Photoshop" required />
            <TextareaField name="description" label="Description" placeholder="Learn essential Photoshop tools and techniques for professional graphic design work..." required />

            <div className="grid grid-cols-2 gap-4">
              <InputField name="estimatedDuration" label="Estimated Duration" placeholder="2 weeks" required />
              <SelectField name="status" label="Status" options={STATUS_OPTIONS} />
            </div>

            <TextareaField
              name="learningObjectives"
              label="Learning Objectives (one per line)"
              placeholder="Master Photoshop selection tools and layers
Create professional photo manipulations
Apply advanced masking and compositing techniques
Design graphics for web and print media"
              rows={4}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <SubmitButton disabled={creating || updating} loadingText="Saving...">
                {mode === 'create' ? 'Create Module' : 'Update Module'}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ModuleFormDialog;
