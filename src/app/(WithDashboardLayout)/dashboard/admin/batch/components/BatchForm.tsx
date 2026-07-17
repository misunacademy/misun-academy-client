"use client"

import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/forms/input-field";
import { TextareaField } from "@/components/forms/textarea-field";
import { SelectField } from "@/components/forms/select-field";
import { SubmitButton } from "@/components/forms/submit-button";
import { useCreateBatchMutation, useUpdateBatchMutation } from "@/redux/api/batchApi";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const BATCH_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "upcoming", label: "Upcoming" },
  { value: "running", label: "Running" },
  { value: "completed", label: "Completed" },
];

interface Course { _id: string; title: string }

interface BatchFormProps {
  mode: 'create' | 'edit';
  courses: Course[];
  coursesLoading: boolean;
  defaultValues?: {
    _id: string;
    title: string;
    price: number;
    status: string;
    courseId: string;
    startDate: string;
    endDate: string;
    enrollmentStartDate: string;
    enrollmentEndDate: string;
    description?: string;
  };
  onCancel: () => void;
  onSuccess: () => void;
}

const batchSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.string().min(1, "Price is required"),
  status: z.enum(["draft", "upcoming", "running", "completed"]),
  courseId: z.string().min(1, "Course is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  enrollmentStartDate: z.string().min(1, "Enrollment start is required"),
  enrollmentEndDate: z.string().min(1, "Enrollment end is required"),
  description: z.string().optional(),
});

type BatchFormValues = z.infer<typeof batchSchema>;

export function BatchForm({ mode, courses, coursesLoading, defaultValues, onCancel, onSuccess }: BatchFormProps) {
  const [createBatch, { isLoading: isCreating }] = useCreateBatchMutation();
  const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchMutation();

  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema) as Resolver<BatchFormValues>,
    defaultValues: {
      title: defaultValues?.title || '',
      price: defaultValues?.price?.toString() || '',
      status: (defaultValues?.status as BatchFormValues['status']) || 'draft',
      courseId: defaultValues?.courseId || '',
      startDate: defaultValues?.startDate?.split('T')[0] || '',
      endDate: defaultValues?.endDate?.split('T')[0] || '',
      enrollmentStartDate: defaultValues?.enrollmentStartDate?.split('T')[0] || '',
      enrollmentEndDate: defaultValues?.enrollmentEndDate?.split('T')[0] || '',
      description: defaultValues?.description || '',
    },
  });

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (values: BatchFormValues) => {
    const batchData = {
      title: values.title,
      price: Number(values.price),
      status: values.status,
      courseId: values.courseId,
      startDate: values.startDate ? new Date(values.startDate) : undefined,
      endDate: values.endDate ? new Date(values.endDate) : undefined,
      enrollmentStartDate: values.enrollmentStartDate ? new Date(values.enrollmentStartDate) : undefined,
      enrollmentEndDate: values.enrollmentEndDate ? new Date(values.enrollmentEndDate) : undefined,
      description: values.description || undefined,
    };

    try {
      if (mode === 'edit' && defaultValues?._id) {
        await updateBatch({ id: defaultValues._id, data: batchData }).unwrap();
        toast.success("Batch updated successfully");
      } else {
        await createBatch(batchData).unwrap();
        toast.success("Batch created successfully");
      }
      onSuccess();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || (mode === 'edit' ? "Failed to update batch" : "Failed to create batch"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{mode === 'edit' ? "Edit Batch" : "Create New Batch"}</CardTitle>
            <CardDescription>{mode === 'edit' ? "Update batch information" : "Add a new batch with all required details"}</CardDescription>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onCancel}><X className="w-4 h-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="course">Course *</Label>
              <Controller
                name="courseId"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value || ""} onValueChange={field.onChange} required>
                    <SelectTrigger id="course" aria-invalid={!!form.formState.errors.courseId}>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {coursesLoading ? (
                        <div className="flex items-center justify-center py-2"><Loader2 className="w-4 h-4 animate-spin" /></div>
                      ) : courses.length > 0 ? (
                        courses.map((course) => (
                          <SelectItem key={course._id} value={course._id}>{course.title}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-courses" disabled>No courses available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.courseId && (
                <p className="text-sm font-medium text-destructive" role="alert">{form.formState.errors.courseId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField name="title" label="Batch Title" placeholder="e.g. Batch 6 - Winter 2026" required />
              <InputField name="price" label="Price (BDT)" type="number" placeholder="4000" required />
              <SelectField name="status" label="Status" options={BATCH_STATUSES} />
            </div>

            <TextareaField name="description" label="Description" placeholder="Brief description of this batch" rows={3} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="startDate" label="Batch Start Date" type="date" required />
              <InputField name="endDate" label="Batch End Date" type="date" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="enrollmentStartDate" label="Enrollment Start" type="date" required />
              <InputField name="enrollmentEndDate" label="Enrollment End" type="date" required />
            </div>

            <div className="flex gap-2">
              <SubmitButton disabled={isSubmitting}>
                {mode === 'edit' ? "Update Batch" : "Create Batch"}
              </SubmitButton>
              {mode === 'edit' && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
