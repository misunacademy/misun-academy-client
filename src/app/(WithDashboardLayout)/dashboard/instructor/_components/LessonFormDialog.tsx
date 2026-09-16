"use client"

import { useForm, useWatch, useFieldArray, FormProvider, type Control, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import { InputField } from "@/components/forms/input-field"
import { TextareaField } from "@/components/forms/textarea-field"
import { SelectField } from "@/components/forms/select-field"
import { SwitchField } from "@/components/forms/switch-field"
import { SubmitButton } from "@/components/forms/submit-button"
import {
  useCreateInstructorLessonMutation,
  useUpdateInstructorLessonMutation,
  type InstructorLesson,
} from "@/redux/api/instructorApi"

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["link", "text"]),
  url: z.string().optional(),
  textContent: z.string().optional(),
})

const lessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["video", "reading", "quiz", "project"]),
  videoSource: z.enum(["youtube", "googledrive"]).optional(),
  videoId: z.string().optional(),
  videoUrl: z.string().optional(),
  videoDuration: z.coerce.number().optional(),
  content: z.string().optional(),
  isMandatory: z.boolean(),
  resources: z.array(resourceSchema),
})

type LessonFormValues = z.infer<typeof lessonSchema>

const LESSON_TYPE_OPTIONS = [
  { value: "video", label: "Video" },
  { value: "reading", label: "Reading" },
  { value: "quiz", label: "Quiz" },
  { value: "project", label: "Project" },
]

const VIDEO_SOURCE_OPTIONS = [
  { value: "youtube", label: "YouTube" },
  { value: "googledrive", label: "Google Drive" },
]

const RESOURCE_TYPE_OPTIONS = [
  { value: "link", label: "Link" },
  { value: "text", label: "Text" },
]

interface LessonFormDialogProps {
  open: boolean
  mode: "create" | "edit"
  moduleId?: string
  data?: InstructorLesson
  onClose: () => void
  onSuccess: () => void
}

export function LessonFormDialog({ open, mode, moduleId, data, onClose, onSuccess }: LessonFormDialogProps) {
  const [create, { isLoading: creating }] = useCreateInstructorLessonMutation()
  const [update, { isLoading: updating }] = useUpdateInstructorLessonMutation()

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema) as Resolver<LessonFormValues>,
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      type: data?.type || "video",
      videoSource: data?.videoSource || "youtube",
      videoId: data?.videoId || "",
      videoUrl: data?.videoUrl || "",
      videoDuration: data?.videoDuration || 0,
      content: data?.content || "",
      isMandatory: data?.isMandatory ?? true,
      resources: (data?.resources || []) as LessonFormValues["resources"],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "resources",
  })

  const watchedType = useWatch({ control: form.control, name: "type" })

  const handleSubmit = async (values: LessonFormValues) => {
    try {
      const payload = { ...values }
      if (payload.type !== "video") {
        delete payload.videoSource
        delete payload.videoId
        delete payload.videoUrl
        delete payload.videoDuration
      }

      if (mode === "create") {
        await create({ moduleId: moduleId!, ...payload }).unwrap()
        toast.success("Lesson created")
      } else {
        await update({ lessonId: data!._id, ...payload }).unwrap()
        toast.success("Lesson updated")
      }
      onSuccess()
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      toast.error(error?.data?.message || "Operation failed")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Lesson" : "Edit Lesson"}</DialogTitle>
          <DialogDescription>Fill in the lesson details.</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <InputField name="title" label="Title" placeholder="Enter title of the lesson..." required />
            <TextareaField name="description" label="Description" placeholder="Enter description..." />

            <div className="grid grid-cols-2 gap-4">
              <SelectField name="type" label="Type" options={LESSON_TYPE_OPTIONS} required />
              <div className="flex items-end pb-2">
                <SwitchField name="isMandatory" label="Mandatory" />
              </div>
            </div>

            {watchedType === "video" && (
              <>
                <SelectField name="videoSource" label="Video Source" options={VIDEO_SOURCE_OPTIONS} />
                <InputField name="videoId" label="Video ID" placeholder="dQw4w9WgXcQ" />
                <InputField name="videoDuration" label="Duration (seconds)" type="number" />
              </>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Resources</label>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ title: "", type: "link", url: "", textContent: "" })}>
                  <Plus className="h-4 w-4 mr-2" />Add Resource
                </Button>
              </div>
              {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">No resources added yet</p>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <ResourceCard
                      key={field.id}
                      control={form.control}
                      index={index}
                      onRemove={() => remove(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <SubmitButton disabled={creating || updating}>
                {mode === "create" ? "Create" : "Update"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

function ResourceCard({ control, index, onRemove }: {
  control: Control<LessonFormValues>;
  index: number;
  onRemove: () => void;
}) {
  const resourceType = useWatch({ control, name: `resources.${index}.type` as const });
  return (
    <Card className="p-3">
      <CardContent className="p-0 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Resource {index + 1}</label>
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <InputField name={`resources.${index}.title`} label="Title" placeholder="Resource title" required rules={{ required: "Title is required" }} />
        <SelectField name={`resources.${index}.type`} label="Type" options={RESOURCE_TYPE_OPTIONS} />
        {resourceType === "link" && (
          <InputField name={`resources.${index}.url`} label="URL" type="url" placeholder="https://example.com" rules={{ required: "URL is required" }} />
        )}
        {resourceType === "text" && (
          <TextareaField name={`resources.${index}.textContent`} label="Text Content" placeholder="Enter text content..." rows={3} rules={{ required: "Content is required" }} />
        )}
      </CardContent>
    </Card>
  )
}
