"use client";

import { useMemo, useState } from "react";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { useGetAllBatchesQuery } from "@/redux/api/batchApi";
import { useGrantAccessByEmailMutation, useGetSpecialAccessEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import { useGetAllUsersQuery } from "@/redux/api/adminApi";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, KeyRound, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const GrantCourseAccessPage = () => {
  const [email, setEmail] = useState("");
  const [courseId, setCourseId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [specialPage, setSpecialPage] = useState(1);

  const { data: coursesData, isLoading: isCoursesLoading } = useGetAllCoursesQuery({});
  const courses = useMemo(() => coursesData?.data || [], [coursesData]);

  const { data: batchesData, isLoading: isBatchesLoading } = useGetAllBatchesQuery(
    { courseId },
    { skip: !courseId }
  );
  const batches = useMemo(() => batchesData?.data || [], [batchesData]);

  const [grantAccess, { isLoading: isGranting }] = useGrantAccessByEmailMutation();
  const { data: specialAccessData, isLoading: isSpecialLoading, isError: isSpecialError } =
    useGetSpecialAccessEnrollmentsQuery({ page: specialPage, limit: 10 });

  const specialMeta = specialAccessData?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };
  const totalSpecialPages = Math.max(1, specialMeta.totalPages ?? 1);
  const isFirstSpecialPage = specialPage <= 1;
  const isLastSpecialPage = specialPage >= totalSpecialPages;

  const normalizedEmail = email.trim().toLowerCase();
  const { data: usersData, isFetching: isCheckingUser } = useGetAllUsersQuery(
    normalizedEmail ? { search: normalizedEmail, limit: 5, page: 1 } : undefined,
    { skip: !normalizedEmail }
  );
  const matchedUser = useMemo(() => {
    if (!normalizedEmail) {
      return null;
    }

    const users = usersData?.data || [];
    return users.find((user) => user.email?.toLowerCase() === normalizedEmail) || null;
  }, [normalizedEmail, usersData]);

  const handleCourseChange = (value: string) => {
    setCourseId(value);
    setBatchId("");
  };

  const isFormValid = Boolean(normalizedEmail && courseId && batchId);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      toast.error("Missing details", {
        description: "Email, course, and batch are required.",
      });
      return;
    }

    try {
      const result = await grantAccess({
        email: normalizedEmail,
        courseId,
        batchId,
      }).unwrap();

      toast.success(result?.message || "Access granted successfully.");
      setEmail("");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error("Unable to grant access", {
        description: err?.data?.message || "Please try again later.",
      });
    }
  };

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
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="student-email">Student Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
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
                    <Select value={courseId} onValueChange={handleCourseChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {isCoursesLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading courses...
                          </SelectItem>
                        ) : courses.length > 0 ? (
                          courses.map((course) => (
                            <SelectItem key={course._id} value={course._id}>
                              {course.title}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-courses" disabled>
                            No courses available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Batch</Label>
                    <Select value={batchId} onValueChange={setBatchId}>
                      <SelectTrigger disabled={!courseId}>
                        <SelectValue placeholder={courseId ? "Select a batch" : "Select a course first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {!courseId ? (
                          <SelectItem value="no-course" disabled>
                            Select a course first
                          </SelectItem>
                        ) : isBatchesLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading batches...
                          </SelectItem>
                        ) : batches.length > 0 ? (
                          batches.map((batch) => (
                            <SelectItem key={batch._id} value={batch._id}>
                              {batch.title} - {batch.status}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-batches" disabled>
                            No batches found for this course
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Grant access only after confirming the student identity and request.
                  </p>
                  <Button type="submit" disabled={!isFormValid || isGranting}>
                    {isGranting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Granting...
                      </>
                    ) : (
                      "Grant Access"
                    )}
                  </Button>
                </div>
              </form>
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
              ) : specialAccessData?.data?.length ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Batch</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Granted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {specialAccessData.data.map((entry) => {
                          const user = entry.userId;
                          const batch = entry.batchId;
                          const course = typeof batch?.courseId === "string" ? undefined : batch?.courseId;
                          return (
                            <TableRow key={entry._id}>
                              <TableCell>{user?.name || "Unknown"}</TableCell>
                              <TableCell>{user?.email || "-"}</TableCell>
                              <TableCell>{course?.title || "-"}</TableCell>
                              <TableCell>{batch?.title || "-"}</TableCell>
                              <TableCell className="capitalize">{entry.status}</TableCell>
                              <TableCell>
                                {entry.enrolledAt
                                  ? new Date(entry.enrolledAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      Showing {specialAccessData.data.length} of {specialMeta.total} students
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSpecialPage((prev) => Math.max(prev - 1, 1))}
                        disabled={isSpecialLoading || isFirstSpecialPage}
                        className="border-gray-300"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span>
                        Page {specialPage} of {totalSpecialPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSpecialPage((prev) => Math.min(prev + 1, totalSpecialPages))}
                        disabled={isSpecialLoading || isLastSpecialPage}
                        className="border-gray-300"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No special access students yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      }
    />
  );
};

export default GrantCourseAccessPage;
