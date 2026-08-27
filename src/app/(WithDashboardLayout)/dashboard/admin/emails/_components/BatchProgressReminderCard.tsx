"use client"

import { Controller, useForm, useWatch, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { skipToken } from "@reduxjs/toolkit/query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { AlertTriangle, Send, Loader2 } from "lucide-react"
import { useSendBatchProgressReminderMutation } from "@/redux/api/adminApi"
import { useGetAllBatchesQuery } from "@/redux/api/batchApi"
import type { CourseResponse } from "@/redux/api/courseApi"
import { Form } from "@/components/ui/form"

const reminderSchema = z.object({
  courseId: z.string().min(1, "Select a course"),
  batchId: z.string().min(1, "Select a batch"),
})

type ReminderFormValues = z.infer<typeof reminderSchema>

export default function BatchProgressReminderCard({ courses }: { courses: CourseResponse[] }) {
  const [sendReminder, { isLoading }] = useSendBatchProgressReminderMutation()

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema) as Resolver<ReminderFormValues>,
    defaultValues: { courseId: "", batchId: "" },
  })

  const watchedCourseId = useWatch({ control: form.control, name: "courseId" })

  const { data: batchesData } = useGetAllBatchesQuery(
    watchedCourseId ? { courseId: watchedCourseId } : skipToken,
  )
  const batches = batchesData?.data ?? []

  const handleCourseChange = (value: string) => {
    form.setValue("courseId", value)
    form.setValue("batchId", "")
  }

  const handleSubmit = async (values: ReminderFormValues) => {
    try {
      const result = await sendReminder(values).unwrap()
      toast.success(result.message || `Batch progress reminders sent to ${result.data.count} students!`, {
        description: <span className="text-foreground/50">Emails have been queued and will be sent shortly.</span>,
      })
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } }
      toast.error("Failed to send batch progress reminders", {
        description: <span className="text-foreground/50">{err?.data?.message || "Please try again later."}</span>,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <CardTitle>Running Batch Progress Reminder</CardTitle>
            <CardDescription className="mt-1">
              Send reminders to students below 50% progress in a running batch
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Course *</Label>
              <Controller
                name="courseId"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value || ""} onValueChange={handleCourseChange}>
                    <SelectTrigger aria-invalid={!!form.formState.errors.courseId}>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.length === 0 ? (
                        <div className="px-2 py-4 text-sm text-muted-foreground text-center">No courses available</div>
                      ) : (
                        courses.map((course) => (
                          <SelectItem key={course._id} value={course._id}>{course.title}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.courseId && (
                <p className="text-sm font-medium text-destructive" role="alert">{form.formState.errors.courseId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Batch *</Label>
              <Controller
                name="batchId"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value || ""} onValueChange={field.onChange} disabled={!watchedCourseId}>
                    <SelectTrigger aria-invalid={!!form.formState.errors.batchId}>
                      <SelectValue placeholder={watchedCourseId ? "Select batch" : "Select course first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.length === 0 ? (
                        <div className="px-2 py-4 text-sm text-muted-foreground text-center">No batches available</div>
                      ) : (
                        batches.map((batch) => (
                          <SelectItem key={batch._id} value={batch._id}>
                            {batch.title} ({batch.status})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.batchId && (
                <p className="text-sm font-medium text-destructive" role="alert">{form.formState.errors.batchId.message}</p>
              )}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Criteria:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Batch must be running</li>
                <li>Student progress below 50%</li>
                <li>Only verified and active users</li>
              </ul>
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" />Send Progress Reminders</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
