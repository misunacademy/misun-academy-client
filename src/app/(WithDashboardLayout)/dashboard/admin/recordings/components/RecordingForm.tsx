"use client";

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/forms/input-field";
import { TextareaField } from "@/components/forms/textarea-field";
import { SelectField } from "@/components/forms/select-field";
import { CheckboxField } from "@/components/forms/checkbox-field";
import { SubmitButton } from "@/components/forms/submit-button";
import type { CourseResponse } from "@/redux/api/courseApi";
import type { BatchResponse } from "@/redux/api/batchApi";

const recordingSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  batchId: z.string().min(1, "Batch is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  sessionDate: z.string().min(1, "Session date is required"),
  videoSource: z.enum(["youtube", "googledrive"]),
  videoId: z.string().min(1, "Video ID is required"),
  duration: z.string().default(""),
  isPublished: z.boolean().default(false),
});

export type RecordingFormValues = z.infer<typeof recordingSchema>;

interface RecordingFormProps {
  defaultValues?: Partial<RecordingFormValues>;
  courses: CourseResponse[];
  batches: BatchResponse[];
  onSubmit: (values: RecordingFormValues) => Promise<void>;
  isLoading: boolean;
}

const VIDEO_SOURCE_OPTIONS = [
  { value: "youtube", label: "YouTube" },
  { value: "googledrive", label: "Google Drive" },
];

const RecordingForm = ({
  defaultValues,
  courses,
  batches,
  onSubmit,
  isLoading,
}: RecordingFormProps) => {
  const form = useForm<RecordingFormValues>({
    resolver: zodResolver(recordingSchema) as Resolver<RecordingFormValues>,
    defaultValues: {
      courseId: "",
      batchId: "",
      title: "",
      description: "",
      sessionDate: "",
      videoSource: "youtube",
      videoId: "",
      duration: "",
      isPublished: false,
      ...defaultValues,
    },
  });

  const watchedVideoSource = useWatch({ control: form.control, name: "videoSource" });
  const watchedCourseId = useWatch({ control: form.control, name: "courseId" });
  const courseOptions = courses.map((c) => ({ value: c._id, label: c.title }));
  const batchOptions = batches.map((b) => ({ value: b._id, label: `${b.title} - ${b.status}` }));

  const videoDescription =
    watchedVideoSource === "youtube"
      ? "YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID"
      : "Google Drive URL: https://drive.google.com/file/d/FILE_ID/view";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            name="courseId"
            label="Course"
            options={courseOptions}
            placeholder="Select course"
            required
            onValueChange={() => form.setValue("batchId", "")}
          />
          <SelectField
            name="batchId"
            label="Batch"
            options={batchOptions}
            placeholder="Select batch"
            disabled={!watchedCourseId}
            required
          />
        </div>

        <InputField name="title" label="Title" placeholder="e.g., Week 1: Introduction to JavaScript" required />

        <TextareaField name="description" label="Description" placeholder="Brief description of the session content" rows={3} />

        <div className="grid grid-cols-2 gap-4">
          <InputField name="sessionDate" label="Session Date" type="date" required />
          <InputField name="duration" label="Duration (minutes)" type="number" placeholder="e.g., 90" />
        </div>

        <SelectField name="videoSource" label="Video Source" options={VIDEO_SOURCE_OPTIONS} required />

        <InputField
          name="videoId"
          label="Video ID"
          required
          description={videoDescription}
          placeholder={
            watchedVideoSource === "youtube"
              ? "YouTube video ID (e.g., dQw4w9WgXcQ)"
              : "Google Drive file ID"
          }
        />

        <CheckboxField name="isPublished" label="Publish immediately (students can view)" />

        <div className="flex justify-end gap-2 pt-4">
          <SubmitButton disabled={isLoading} loadingText="Saving...">
            Save Recording
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default RecordingForm;
