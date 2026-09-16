"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { BatchResponse, useGetAllBatchesQuery } from "@/redux/api/batchApi";
import { useGetAllEnrollmentsQuery, type EnrollmentResponse } from "@/redux/api/enrollmentApi";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProgressFilters } from "./ProgressFilters";

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
  

  const columns = useMemo<ColumnDef<EnrollmentResponse>[]>(() => [
    { accessorKey: "studentId", header: "Student ID", cell: ({ row }) => <span>{row.original.studentId || row.original.enrollmentId || "N/A"}</span> },
    { id: "student", header: "Student", cell: ({ row }) => <div><p className="font-medium">{row.original.student?.name || "N/A"}</p><p className="text-xs text-muted-foreground">{row.original.student?.email || "N/A"}</p></div> },
    { id: "course", header: "Course", cell: ({ row }) => <span>{row.original.course?.title || "N/A"}</span> },
    { id: "batch", header: "Batch", cell: ({ row }) => <span>{row.original.batch?.title || "N/A"}</span> },
    { id: "modules", header: "Modules", cell: ({ row }) => { const p = getProgressInfo(row.original); return <span>{p.completedModules}/{p.totalModules}</span> } },
    { id: "progress", header: "Progress", cell: ({ row }) => { const p = getProgressInfo(row.original); return <div className="space-y-1 min-w-[170px]"><Progress value={p.overallProgress} /><p className="text-xs text-muted-foreground">{p.overallProgress}%</p></div> } },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={getStatusVariant(row.original.status)} className="capitalize">{row.original.status.replace("-", " ")}</Badge> },
    { accessorKey: "createdAt", header: "Enrolled", cell: ({ row }) => <span>{new Date(row.original.createdAt).toLocaleDateString()}</span> },
  ], []);

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
      <DataTable
        heading="Student Progress Details"
        subheading={`Showing ${enrollments.length} of ${meta.total} students`}
        columns={columns}
        data={enrollments}
        getRowId={(e) => e._id}
        emptyState="No students found for the selected filters."
        pagination={{
          page,
          totalPages,
          total: meta?.total ?? 0,
          limit,
          onPageChange: setPage,
        }}
      />
    </div>
  );
};

export default StudentProgressTracker;
