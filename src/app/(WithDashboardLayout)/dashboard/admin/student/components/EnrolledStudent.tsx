'use client';

import { useState, useMemo, useEffect } from "react";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAllEnrollmentsQuery, type EnrollmentResponse } from "@/redux/api/enrollmentApi";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { useGetAllBatchesQuery } from "@/redux/api/batchApi";
import StudentFiltersCard from "@/app/(WithDashboardLayout)/dashboard/admin/student/components/StudentFiltersCard";

const EnrolledStudentTable = () => {
    // Opt out of React Compiler: TanStack Table's `useReactTable()` returns
    // fresh function identities every render by design, so the component
    // cannot be memoized safely (react-hooks/incompatible-library). This is
    // behavior-preserving — the compiler was already skipping this component
    // implicitly. No values from `table` flow into memoized children
    // (StudentFiltersCard receives only primitives and stable setters), so
    // there is no stale-UI hazard.
    "use no memo";
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedCourseId, setSelectedCourseId] = useState("all");
    const [selectedBatchId, setSelectedBatchId] = useState("all");

    const { data: coursesData } = useGetAllCoursesQuery({});
    const courses = coursesData?.data || [];
    const { data: batchesData } = useGetAllBatchesQuery({
        courseId: selectedCourseId !== "all" ? selectedCourseId : undefined,
    });
    const batches = batchesData?.data || [];

    useEffect(() => {
        setSelectedBatchId("all");
    }, [selectedCourseId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading, isError } = useGetAllEnrollmentsQuery({
        page,
        search: debouncedSearch || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        courseId: selectedCourseId !== "all" ? selectedCourseId : undefined,
        batchId: selectedBatchId !== "all" ? selectedBatchId : undefined,
    });

    const students = data?.data || [];
    const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

    const columns = useMemo<ColumnDef<EnrollmentResponse>[]>(
        () => [
            {
                accessorKey: "studentId",
                header: "Student ID",
                cell: ({ row }) => row.original.studentId || row.original.enrollmentId || row.original.userId || 'N/A',
            },
            {
                accessorKey: 'studentName',
                header: "Student Name",
                cell: ({ row }) => row.original.student?.name || row.original.userId || 'N/A',
            },
            {
                accessorKey: 'email',
                header: "Email",
                cell: ({ row }) => row.original.student?.email || 'N/A',
            },
            {
                accessorKey: 'phone',
                header: "Phone",
                cell: ({ row }) => row.original.student?.phone || 'N/A',
            },
            {
                id: 'course',
                header: "Course",
                cell: ({ row }) => {
                    // Backend `GET /enrollments` returns shaped `course`/`batch`
                    // objects; fall back to the legacy populated `batchId`
                    // shape for backward compatibility.
                    const shaped = row.original.course?.title;
                    if (shaped) return shaped;
                    const course = (row.original.batchId as unknown as { courseId?: { title?: string } | string } | undefined)?.courseId;
                    if (!course) return 'N/A';
                    return typeof course === 'string' ? course : course.title || 'N/A';
                },
            },
            {
                id: 'batch',
                header: "Batch",
                cell: ({ row }) => {
                    const shaped = row.original.batch?.title;
                    if (shaped) return shaped;
                    const batch = row.original.batchId as unknown as { title?: string } | string | undefined;
                    if (!batch) return 'N/A';
                    return typeof batch === 'string' ? batch : batch.title || 'N/A';
                },
            },
            {
                id: 'status',
                header: "Status",
                cell: ({ row }) => (
                    <Badge
                        variant={row.original.status === 'active' ? 'default' : 'secondary'}
                        className="capitalize"
                    >
                        {row.original.status || 'N/A'}
                    </Badge>
                ),
            },
            {
                id: 'progress',
                header: "Progress",
                cell: ({ row }) => {
                    const progress = row.original.progress;
                    if (!progress) return 'N/A';
                    const percent = typeof progress === 'number' ? progress : progress.overallProgress;
                    if (percent === undefined || percent === null) return 'N/A';
                    return (
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-16 rounded-full bg-gray-200">
                                <div
                                    className="h-2 rounded-full bg-emerald-500"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                            <span className="text-xs text-muted-foreground">{percent}%</span>
                        </div>
                    );
                },
            },
            {
                id: 'enrolledAt',
                header: "Enrolled",
                cell: ({ row }) => {
                    if (!row.original.createdAt) return 'N/A';
                    return new Date(row.original.createdAt).toLocaleDateString();
                },
            },
        ],
        []
    );

    // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable returns unmemoizable functions by design; component opts out via "use no memo" above
    const table = useReactTable({
        data: students,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount: meta.totalPages,
        state: { pagination: { pageIndex: page - 1, pageSize: meta.limit } },
        onPaginationChange: (updater) => {
            const newState = typeof updater === 'function'
                ? updater({ pageIndex: page - 1, pageSize: meta.limit })
                : updater;
            setPage(newState.pageIndex + 1);
        },
    });

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-destructive">Failed to load students.</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-gray-50/50 rounded-xl">
            <StudentFiltersCard
                courses={courses}
                batches={batches}
                selectedCourseId={selectedCourseId}
                selectedBatchId={selectedBatchId}
                statusFilter={statusFilter}
                search={search}
                onSearchChange={setSearch}
                onCourseChange={setSelectedCourseId}
                onBatchChange={setSelectedBatchId}
                onStatusChange={setStatusFilter}
            />

            <div className="rounded-lg border bg-white shadow-sm p-4">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div className="flex items-center gap-1">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() ? (
                                                    header.column.getIsSorted() === 'asc' ? (
                                                        <span className="ml-1">🔼</span>
                                                    ) : (
                                                        <span className="ml-1">🔽</span>
                                                    )
                                                ) : null}
                                            </div>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="py-8 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-gray-50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="py-8 text-center text-muted-foreground">
                                    No students found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {table.getRowModel().rows.length} of {meta.total} students
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                        Page {page} of {meta.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
                        disabled={page === meta.totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EnrolledStudentTable;
