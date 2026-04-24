"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

import { useGetEnrolledStudentsQuery } from "@/redux/features/student/studentApi";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { useGetAllBatchesQuery } from "@/redux/api/batchApi";
import type { EnrollmentResponse } from "@/redux/api/enrollmentApi";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const getStatusVariant = (status: string): BadgeVariant => {
    switch (status) {
        case "active":
            return "default";
        case "payment-pending":
        case "pending":
            return "secondary";
        case "completed":
            return "default";
        case "suspended":
        case "payment-failed":
            return "destructive";
        default:
            return "outline";
    }
};

const getProgressInfo = (enrollment: EnrollmentResponse) => {
    const totalModules = enrollment.progress?.totalModules ?? 0;
    const completedModules = enrollment.progress?.completedModules ?? 0;
    const rawProgress = enrollment.progress?.overallProgress ?? 0;
    let overallProgress = Math.max(0, Math.min(100, rawProgress));

    if (enrollment.status === "completed") {
        overallProgress = Math.max(overallProgress, 100);
    }

    return {
        totalModules,
        completedModules,
        overallProgress,
    };
};

const StudentProgressTracker = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState("10");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [courseIdFilter, setCourseIdFilter] = useState("all");
    const [batchIdFilter, setBatchIdFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("active");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const { data: coursesData } = useGetAllCoursesQuery({});
    const courses = coursesData?.data ?? [];

    const { data: batchesData } = useGetAllBatchesQuery({
        courseId: courseIdFilter !== "all" ? courseIdFilter : undefined,
    });

    const batches = useMemo(() => batchesData?.data ?? [], [batchesData?.data]);

    const { data, isLoading, isError } = useGetEnrolledStudentsQuery({
        page,
        limit: Number(limit),
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        courseId: courseIdFilter !== "all" ? courseIdFilter : undefined,
        batchId: batchIdFilter !== "all" ? batchIdFilter : undefined,
    });

    const enrollments = useMemo(() => data?.data ?? [], [data?.data]);
    const meta = useMemo(
        () => data?.meta ?? { total: 0, page: 1, limit: Number(limit), totalPages: 1 },
        [data?.meta, limit]
    );
    const totalPages = Math.max(meta.totalPages || 1, 1);

    const courseWiseSummary = useMemo(() => {
        const grouped: Record<
            string,
            {
                courseTitle: string;
                totalStudents: number;
                completedCount: number;
                inProgressCount: number;
                notStartedCount: number;
                totalProgress: number;
            }
        > = {};

        for (const enrollment of enrollments) {
            const courseKey = enrollment.course?._id || enrollment.course?.title || "uncategorized";
            const courseTitle = enrollment.course?.title || "Unassigned Course";
            const { overallProgress } = getProgressInfo(enrollment);

            if (!grouped[courseKey]) {
                grouped[courseKey] = {
                    courseTitle,
                    totalStudents: 0,
                    completedCount: 0,
                    inProgressCount: 0,
                    notStartedCount: 0,
                    totalProgress: 0,
                };
            }

            grouped[courseKey].totalStudents += 1;
            grouped[courseKey].totalProgress += overallProgress;

            if (overallProgress >= 100 || enrollment.status === "completed") {
                grouped[courseKey].completedCount += 1;
            } else if (overallProgress > 0) {
                grouped[courseKey].inProgressCount += 1;
            } else {
                grouped[courseKey].notStartedCount += 1;
            }
        }

        return Object.values(grouped)
            .map((item) => ({
                ...item,
                averageProgress: item.totalStudents
                    ? Math.round(item.totalProgress / item.totalStudents)
                    : 0,
            }))
            .sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
    }, [enrollments]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                Failed to load student progress data.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Course-wise Progress Overview</CardTitle>
                    <CardDescription>
                        Track student completion and learning momentum by course.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                        <Input
                            placeholder="Search by name, email or ID"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />

                        <Select
                            value={courseIdFilter}
                            onValueChange={(value) => {
                                setCourseIdFilter(value);
                                setBatchIdFilter("all");
                                setPage(1);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by course" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Courses</SelectItem>
                                {courses.map((course) => (
                                    <SelectItem key={course._id} value={course._id}>
                                        {course.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={batchIdFilter}
                            onValueChange={(value) => {
                                setBatchIdFilter(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by batch" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Batches</SelectItem>
                                {batches.map((batch) => (
                                    <SelectItem key={batch._id} value={batch._id}>
                                        {batch.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={statusFilter}
                            onValueChange={(value) => {
                                setStatusFilter(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Enrollment status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="payment-pending">Payment Pending</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                                <SelectItem value="payment-failed">Payment Failed</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={limit}
                            onValueChange={(value) => {
                                setLimit(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Rows per page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10 per page</SelectItem>
                                <SelectItem value="20">20 per page</SelectItem>
                                <SelectItem value="50">50 per page</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {/* {courseWiseSummary.length > 0 ? (
                            courseWiseSummary.map((course) => (
                                <div key={course.courseTitle} className="rounded-lg border p-4">
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <h3 className="font-semibold leading-tight">{course.courseTitle}</h3>
                                        <Badge variant="outline">{course.totalStudents} students</Badge>
                                    </div>
                                    <p className="mb-3 text-sm text-muted-foreground">
                                        Average progress: {course.averageProgress}%
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Completed</span>
                                            <span>{course.completedCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>In Progress</span>
                                            <span>{course.inProgressCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Not Started</span>
                                            <span>{course.notStartedCount}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                No course summary available for the current filters.
                            </div>
                        )} */}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Student Progress Details</CardTitle>
                    <CardDescription>
                        Showing {enrollments.length} of {meta.total} students
                    </CardDescription>
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
                                {enrollments.length > 0 ? (
                                    enrollments.map((enrollment) => {
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
                                                <TableCell>
                                                    {progress.completedModules}/{progress.totalModules}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <Progress value={progress.overallProgress} />
                                                        <p className="text-xs text-muted-foreground">
                                                            {progress.overallProgress}%
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(enrollment.status)} className="capitalize">
                                                        {enrollment.status.replace("-", " ")}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(enrollment.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                                            No students found for the selected filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Page {meta.page} of {totalPages}
                        </p>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={meta.page <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={meta.page >= totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentProgressTracker;