"use client"

import { useMemo, useState } from "react"
import { useForm, useWatch, Controller, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { ColumnDef } from "@tanstack/react-table"
import DashboardPageContainer from "@/components/layout/DashboardPageContainer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useGetAllCoursesQuery } from "@/redux/api/courseApi"
import { useGetAllBatchesQuery } from "@/redux/api/batchApi"
import { useGrantAccessByEmailMutation, useGetSpecialAccessEnrollmentsQuery, type SpecialAccessEnrollment } from "@/redux/api/enrollmentApi"
import { useGetAllUsersQuery } from "@/redux/api/adminApi"
import { toast } from "sonner"
import { KeyRound, Loader2 } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { Form } from "@/components/ui/form"

const grantSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  courseId: z.string().min(1, "Select a course"),
  batchId: z.string().min(1, "Select a batch"),
})

type GrantFormValues = z.infer<typeof grantSchema>

const GrantCourseAccessPage = () => {
  const [specialPage, setSpecialPage] = useState(1)

  const { data: coursesData, isLoading: isCoursesLoading } = useGetAllCoursesQuery({})
  const courses = useMemo(() => coursesData?.data || [], [coursesData])

  const [grantAccess, { isLoading: isGranting }] = useGrantAccessByEmailMutation()
  const { data: specialAccessData, isLoading: isSpecialLoading, isError: isSpecialError } =
    useGetSpecialAccessEnrollmentsQuery({ page: specialPage, limit: 10 })

  const specialMeta = specialAccessData?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
  const totalSpecialPages = Math.max(1, specialMeta.totalPages ?? 1)

  const specialColumns = useMemo<ColumnDef<SpecialAccessEnrollment>[]>(() => [
    { id: "student", header: "Student", cell: ({ row }) => <span>{row.original.userId?.name || "Unknown"}</span> },
    { id: "email", header: "Email", cell: ({ row }) => <span>{row.original.userId?.email || "-"}</span> },
    { id: "course", header: "Course", cell: ({ row }) => { const course = row.original.batchId?.courseId; return <span>{typeof course === "object" ? course?.title : "-"}</span> } },
    { id: "batch", header: "Batch", cell: ({ row }) => <span>{row.original.batchId?.title || "-"}</span> },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <span className="capitalize">{row.original.status}</span> },
    { accessorKey: "enrolledAt", header: "Granted", cell: ({ row }) => <span>{row.original.enrolledAt ? new Date(row.original.enrolledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}</span> },
  ], [])

  const form = useForm<GrantFormValues>({
    resolver: zodResolver(grantSchema) as Resolver<GrantFormValues>,
    defaultValues: { email: "", courseId: "", batchId: "" },
  })

  const watchedEmail = useWatch({ control: form.control, name: "email" })
  const watchedCourseId = useWatch({ control: form.control, name: "courseId" })
  const normalizedEmail = watchedEmail.trim().toLowerCase()

  const { data: batchesData, isLoading: isBatchesLoading } = useGetAllBatchesQuery(
    { courseId: watchedCourseId },
    { skip: !watchedCourseId },
  )
  const batches = useMemo(() => batchesData?.data || [], [batchesData])

  const { data: usersData, isFetching: isCheckingUser } = useGetAllUsersQuery(
    normalizedEmail ? { search: normalizedEmail, limit: 5, page: 1 } : undefined,
    { skip: !normalizedEmail },
  )
  const matchedUser = useMemo(() => {
    if (!normalizedEmail) return null
    const users = usersData?.data || []
    return users.find((user) => user.email?.toLowerCase() === normalizedEmail) || null
  }, [normalizedEmail, usersData])

  const handleCourseChange = (value: string) => {
    form.setValue("courseId", value)
    form.setValue("batchId", "")
  }

  const handleSubmit = async (values: GrantFormValues) => {
    try {
      const result = await grantAccess({
        email: values.email.trim().toLowerCase(),
        courseId: values.courseId,
        batchId: values.batchId,
      }).unwrap()

      toast.success((result as { message?: string })?.message || "Access granted successfully.")
      form.reset()
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } }
      toast.error("Unable to grant access", {
        description: err?.data?.message || "Please try again later.",
      })
    }
  }

  return (
    <DashboardPageContainer
      heading="Grant Special Access"
      subheading="Give a registered student special access to a course and batch using their email address."
      content={
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Grant special access</CardTitle>
                  <CardDescription>
                    This action creates a special access enrollment without payment verification.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Student Email</Label>
                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          id="student-email"
                          type="email"
                          placeholder="student@example.com"
                          {...field}
                          aria-invalid={!!form.formState.errors.email}
                        />
                      )}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm font-medium text-destructive" role="alert">{form.formState.errors.email.message}</p>
                    )}
                    {normalizedEmail ? (
                      <div className="flex items-center gap-2 text-sm">
                        {isCheckingUser ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            <span className="text-muted-foreground">Checking user...</span>
                          </>
                        ) : matchedUser ? (
                          <span className="text-emerald-600">
                            User found: {matchedUser.name} ({matchedUser.status})
                          </span>
                        ) : (
                          <span className="text-red-600">No user found for this email.</span>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Enter an email to verify the user.</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Course</Label>
                      <Controller
                        name="courseId"
                        control={form.control}
                        render={({ field }) => (
                          <Select value={field.value || ""} onValueChange={handleCourseChange}>
                            <SelectTrigger aria-invalid={!!form.formState.errors.courseId}>
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                              {isCoursesLoading ? (
                                <SelectItem value="loading" disabled>Loading courses...</SelectItem>
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

                    <div className="space-y-2">
                      <Label>Batch</Label>
                      <Controller
                        name="batchId"
                        control={form.control}
                        render={({ field }) => (
                          <Select value={field.value || ""} onValueChange={field.onChange}>
                            <SelectTrigger disabled={!watchedCourseId} aria-invalid={!!form.formState.errors.batchId}>
                              <SelectValue placeholder={watchedCourseId ? "Select a batch" : "Select a course first"} />
                            </SelectTrigger>
                            <SelectContent>
                              {!watchedCourseId ? (
                                <SelectItem value="no-course" disabled>Select a course first</SelectItem>
                              ) : isBatchesLoading ? (
                                <SelectItem value="loading" disabled>Loading batches...</SelectItem>
                              ) : batches.length > 0 ? (
                                batches.map((batch) => (
                                  <SelectItem key={batch._id} value={batch._id}>
                                    {batch.title} - {batch.status}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-batches" disabled>No batches found for this course</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {form.formState.errors.batchId && (
                        <p className="text-sm font-medium text-destructive" role="alert">{form.formState.errors.batchId.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Grant access only after confirming the student identity and request.
                    </p>
                    <Button type="submit" disabled={isGranting}>
                      {isGranting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Granting...</>
                      ) : (
                        "Grant Access"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Special access students</CardTitle>
              <CardDescription>Recent students with special access grants.</CardDescription>
            </CardHeader>
            <CardContent>
              {isSpecialLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading special access list...
                </div>
              ) : isSpecialError ? (
                <p className="text-sm text-red-600">Failed to load special access students.</p>
              ) : (
                <DataTable
                  columns={specialColumns}
                  data={specialAccessData?.data ?? []}
                  getRowId={(e) => e._id}
                  emptyState="No special access students yet."
                  pagination={{
                    page: specialPage,
                    totalPages: totalSpecialPages,
                    total: specialMeta.total,
                    limit: 10,
                    onPageChange: setSpecialPage,
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      }
    />
  )
}

export default GrantCourseAccessPage
