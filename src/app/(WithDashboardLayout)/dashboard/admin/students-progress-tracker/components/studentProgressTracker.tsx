"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { BatchResponse, useGetAllBatchesQuery } from "@/redux/api/batchApi";
import { useGetAllEnrollmentsQuery, type EnrollmentResponse } from "@/redux/api/enrollmentApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProgressFilters } from "./ProgressFilters";
import { ProgressPagination } from "./ProgressPagination";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";
const STATUS_VARIANT_MAP: Record<string, BadgeVariant> = {
  active: "default", "payment-pending": "secondary", pending: "secondary",
  completed: "default", suspended: "destructive", "payment-failed": "destructive",
};

const getStatusVariant = (status: string): BadgeVariant => STATUS_VARIANT_MAP[status] ?? "outline";

const getProgressInfo = (enrollment: EnrollmentResponse) => {
  const totalModules = enrollment.progress?.totalModules ?? 0;
  const completedModules = enrollment.progress?.completedModules ?? 0;
  const rawProgress = enrollment.progress?.overallProgress ?? 0;
  const overallProgress = enrollment.status === "completed" ? 100 : Math.max(0, Math.min(100, rawProgress));
  return { totalModules, completedModules, overallProgress };
};

const StudentProgressTracker = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState<number>(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [courseIdFilter, setCourseIdFilter] = useState("all");
  const [batchIdFilter, setBatchIdFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search.trim()); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: coursesData } = useGetAllCoursesQuery({});
  const courses = useMemo(() => coursesData?.data ?? [], [coursesData]);

  const getBatchCourseTitle = useCallback((batch: BatchResponse) => {
    if (!batch.courseId) return "";
    if (typeof batch.courseId === "string") return courses.find((course) => course._id === batch.courseId)?.title || "";
    return batch.courseId.title || "";
  }, [courses]);

  const batchesQueryParams = useMemo(() => ({ courseId: courseIdFilter !== "all" ? courseIdFilter : undefined }), [courseIdFilter]);
  const { data: batchesData } = useGetAllBatchesQuery(batchesQueryParams);
  const batches = useMemo(() => batchesData?.data ?? [], [batchesData?.data]);

  const enrollmentsQueryParams = useMemo(() => ({
    page, limit, search: debouncedSearch || undefined,
    status: statusFilter || undefined, courseId: courseIdFilter !== "all" ? courseIdFilter : undefined,
    batchId: batchIdFilter !== "all" ? batchIdFilter : undefined,
  }), [page, limit, debouncedSearch, statusFilter, courseIdFilter, batchIdFilter]);

  const { data, isLoading, isError } = useGetAllEnrollmentsQuery(enrollmentsQueryParams);
  const enrollments = useMemo(() => data?.data ?? [], [data?.data]);
  const meta = useMemo(() => data?.meta ?? { total: 0, page: 1, limit, totalPages: 1 }, [data?.meta, limit]);
  const totalPages = Math.max(meta.totalPages || 1, 1);

  const handleCourseFilterChange = useCallback((value: string) => { setCourseIdFilter(value); setBatchIdFilter("all"); setPage(1); }, []);
  const handleBatchFilterChange = useCallback((value: string) => { setBatchIdFilter(value); setPage(1); }, []);
  const handleStatusFilterChange = useCallback((value: string) => { setStatusFilter(value); setPage(1); }, []);
  const handlePrevPage = useCallback(() => setPage((prev) => Math.max(prev - 1, 1)), []);
  const handleNextPage = useCallback(() => setPage((prev) => Math.min(prev + 1, totalPages)), [totalPages]);

  if (isLoading) return <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (isError) return <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-600">Failed to load student progress data.</div>;

  return (
    <div className="space-y-6">
      <ProgressFilters
        search={search} courseIdFilter={courseIdFilter} batchIdFilter={batchIdFilter} statusFilter={statusFilter}
        courses={courses} batches={batches}
        onSearchChange={setSearch} onCourseChange={handleCourseFilterChange}
        onBatchChange={handleBatchFilterChange} onStatusChange={handleStatusFilterChange}
        getBatchCourseTitle={getBatchCourseTitle}
      />
      <Card>
        <CardHeader>
          <CardTitle>Student Progress Details</CardTitle>
          <CardDescription>Showing {enrollments.length} of {meta.total} students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Modules</TableHead>
                  <TableHead className="min-w-[170px]">Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.length > 0 ? enrollments.map((enrollment) => {
                  const progress = getProgressInfo(enrollment);
                  return (
                    <TableRow key={enrollment._id}>
                      <TableCell>{enrollment.studentId || enrollment.enrollmentId || "N/A"}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{enrollment.student?.name || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">{enrollment.student?.email || "N/A"}</p>
                        </div>
                      </TableCell>
                      <TableCell>{enrollment.course?.title || "N/A"}</TableCell>
                      <TableCell>{enrollment.batch?.title || "N/A"}</TableCell>
                      <TableCell>{progress.completedModules}/{progress.totalModules}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={progress.overallProgress} />
                          <p className="text-xs text-muted-foreground">{progress.overallProgress}%</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant={getStatusVariant(enrollment.status)} className="capitalize">{enrollment.status.replace("-", " ")}</Badge></TableCell>
                      <TableCell>{new Date(enrollment.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">No students found for the selected filters.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <ProgressPagination page={page} totalPages={totalPages} total={meta?.total ?? 0} limit={limit} metaPage={meta.page} onPrevPage={handlePrevPage} onNextPage={handleNextPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProgressTracker;
