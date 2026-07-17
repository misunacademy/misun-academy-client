"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import { InputField } from "@/components/forms/input-field"
import { TextareaField } from "@/components/forms/textarea-field"
import { SelectField } from "@/components/forms/select-field"
import { SubmitButton } from "@/components/forms/submit-button"
import {
  useCreateInstructorModuleMutation,
  useUpdateInstructorModuleMutation,
  type InstructorModule,
  type InstructorCourse,
} from "@/redux/api/instructorApi"

const moduleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  estimatedDuration: z.string().min(1, "Duration is required"),
  status: z.enum(["draft", "published"]),
  learningObjectives: z.string().optional(),
})

type ModuleFormValues = z.infer<typeof moduleSchema>

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
]

interface ModuleFormDialogProps {
  open: boolean
  mode: "create" | "edit"
  courseId: string
  batchId: string
  batches: InstructorCourse["batches"]
  onBatchChange: (batchId: string) => void
  data?: InstructorModule
  onClose: () => void
  onSuccess: () => void
}

export function ModuleFormDialog({
  open, mode, courseId, batchId, batches, onBatchChange, data, onClose, onSuccess,
}: ModuleFormDialogProps) {
  const [create, { isLoading: creating }] = useCreateInstructorModuleMutation()
  const [update, { isLoading: updating }] = useUpdateInstructorModuleMutation()

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema) as Resolver<ModuleFormValues>,
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      estimatedDuration: data?.estimatedDuration || "",
      status: data?.status || "draft",
      learningObjectives: data?.learningObjectives?.join("\n") || "",
    },
  })

  const currentBatchId = data?.batchId || batchId
  const currentBatch = batches.find((batch) => batch._id === currentBatchId)

  const handleSubmit = async (values: ModuleFormValues) => {
    const payload = {
      ...values,
      learningObjectives: values.learningObjectives ? values.learningObjectives.split("\n").filter(Boolean) : [],
    }

    try {
      if (mode === "create") {
        await create({ courseId, batchId: currentBatchId, ...payload }).unwrap()
        toast.success("Module created")
      } else {
        await update({ moduleId: data!._id, ...payload }).unwrap()
        toast.success("Module updated")
      }
      onSuccess()
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      toast.error(error?.data?.message || "Operation failed")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Module" : "Edit Module"}</DialogTitle>
          <DialogDescription>{mode === "create" ? "Create a new module." : "Update module details."}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Batch *</label>
              {mode === "create" ? (
                <Select value={currentBatchId} onValueChange={onBatchChange}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch._id} value={batch._id}>
                        {batch.title} - {batch.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input className="mt-2" value={currentBatch ? `${currentBatch.title} · #${currentBatch.batchNumber} · ${currentBatch.status}` : ""} disabled />
              )}
            </div>

            <InputField name="title" label="Title" placeholder="Enter title of the module..." required />
            <TextareaField name="description" label="Description" placeholder="Enter description..." required />

            <div className="grid grid-cols-2 gap-4">
              <InputField name="estimatedDuration" label="Estimated Duration" placeholder="2 weeks" required />
              <SelectField name="status" label="Status" options={STATUS_OPTIONS} />
            </div>

            <TextareaField
              name="learningObjectives"
              label="Learning Objectives (one per line)"
              placeholder="E.g.- Understand basic concepts\n- Apply knowledge in projects"
              rows={4}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <SubmitButton disabled={creating || updating}>
                {mode === "create" ? "Create" : "Update"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
