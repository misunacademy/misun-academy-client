"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
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

  const watchedVideoSource = form.watch("videoSource");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course <span className="text-red-500">*</span></FormLabel>
                <Select
                  onValueChange={(value) => { field.onChange(value); form.setValue("batchId", ""); }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course._id} value={course._id}>{course.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="batchId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!form.watch("courseId")}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch._id} value={batch._id}>{batch.title} - {batch.status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Week 1: Introduction to JavaScript" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Brief description of the session content" rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sessionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Date <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="e.g., 90" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="videoSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Source <span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="googledrive">Google Drive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="videoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video ID <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={
                    watchedVideoSource === "youtube"
                      ? "YouTube video ID (e.g., dQw4w9WgXcQ)"
                      : "Google Drive file ID"
                  }
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                {watchedVideoSource === "youtube"
                  ? "YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID"
                  : "Google Drive URL: https://drive.google.com/file/d/FILE_ID/view"}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} id="isPublished" />
              </FormControl>
              <FormLabel htmlFor="isPublished" className="cursor-pointer">Publish immediately (students can view)</FormLabel>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Saving..." : "Save Recording"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RecordingForm;
