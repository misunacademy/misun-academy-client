/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, GraduationCap, Loader2, Users, Layers } from "lucide-react";
import {
    useGetInstructorCoursesQuery,
    useGetBatchStudentsQuery,
    type InstructorCourse,
} from "@/redux/api/instructorApi";

// ─── Status badge variant ─────────────────────────────────────────────────────
function getStatusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
    switch (status?.toLowerCase()) {
        case "active": return "default";
        case "completed": return "default";
        case "suspended": return "destructive";
        case "pending": return "outline";
        default: return "secondary";
    }
}

// ─── Student row type ─────────────────────────────────────────────────────────
interface StudentRow {
    _id: string;
    enrollmentId?: string;
    name: string;
    email: string;
    phone: string;
    image?: string;
    status: string;
    enrolledAt: string;
    batchTitle: string;
    courseTitle: string;
}


// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StudentsPage() {
    const { data: coursesData, isLoading: coursesLoading } = useGetInstructorCoursesQuery();
    const courses: InstructorCourse[] = coursesData?.data || [];

    const [selectedCourseId, setSelectedCourseId] = useState("all");
    const [selectedBatchId, setSelectedBatchId] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const PAGE_SIZE = 10;

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => { setDebouncedSearch(search); setPageIndex(0); }, 400);
        return () => clearTimeout(t);
    }, [search]);

    // Reset batch when course changes
    useEffect(() => { setSelectedBatchId("all"); setPageIndex(0); }, [selectedCourseId]);
    useEffect(() => { setPageIndex(0); }, [statusFilter, debouncedSearch]);

    // Batches for the selected course
    const courseBatches = useMemo(() => {
        if (selectedCourseId === "all") return courses.flatMap(c => (c.batches || []).map(b => ({ ...b, courseTitle: c.title })));
        const course = courses.find(c => c._id === selectedCourseId);
        return (course?.batches || []).map(b => ({ ...b, courseTitle: course?.title || "" }));
    }, [courses, selectedCourseId]);

    // When a specific batch is selected use it; otherwise fall back to the first available batch.
    // (Full multi-batch aggregation would require a dedicated server endpoint.)
    const singleBatchId = selectedBatchId !== "all" ? selectedBatchId : (courseBatches[0]?._id ?? "");
    const { data: batchStudentsData, isLoading: studentsLoading } = useGetBatchStudentsQuery(
        singleBatchId,
        { skip: !singleBatchId }
    );


    // Build flat student list from fetched data + course/batch context
    const allStudents: StudentRow[] = useMemo(() => {
        const raw: any[] = batchStudentsData?.data || [];
        const batchMeta = courseBatches.find(b => b._id === singleBatchId);
        return raw.map((enr: any) => ({
            _id: enr._id || enr.userId?._id || Math.random().toString(),
            enrollmentId: enr.enrollmentId,
            name: enr.userId?.name || "Unknown",
            email: enr.userId?.email || "—",
            phone: enr.userId?.phone || "N/A",
            image: enr.userId?.image,
            status: enr.status || "—",
            enrolledAt: enr.enrolledAt || enr.createdAt || "",
            batchTitle: batchMeta?.title || `Batch #${batchMeta?.batchNumber ?? ""}`,
            courseTitle: batchMeta?.courseTitle || "",
        }));
    }, [batchStudentsData, singleBatchId, courseBatches]);

    // Client-side filter + pagination
    const filtered = useMemo(() => {
        return allStudents.filter(s => {
            const q = debouncedSearch.toLowerCase();
            const matchSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
            const matchStatus = statusFilter === "all" || s.status.toLowerCase() === statusFilter.toLowerCase();
            return matchSearch && matchStatus;
        });
    }, [allStudents, debouncedSearch, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageData = filtered.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

    // Stats
    const totalStudents = courses.reduce(
        (sum, c) => sum + (c.batches || []).reduce((s, b) => s + (b.currentEnrollment || 0), 0), 0
    );
    const totalBatches = courses.reduce((sum, c) => sum + (c.batches || []).length, 0);

    // ─── Table columns ────────────────────────────────────────────────────────
    const columns = useMemo<ColumnDef<StudentRow>[]>(() => [
        {
            accessorKey: "name",
            header: "Student",
            cell: ({ row }) => {
                const initials = row.original.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={row.original.image} alt={row.original.name} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{row.original.name}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original?.phone}</span>,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.email}</span>,
        },
        {
            accessorKey: "courseTitle",
            header: "Course",
            cell: ({ row }) => <span className="text-sm">{row.original.courseTitle || "—"}</span>,
        },
        {
            accessorKey: "batchTitle",
            header: "Batch",
            cell: ({ row }) => <span className="text-sm">{row.original.batchTitle || "—"}</span>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={getStatusVariant(row.original.status)} className="capitalize">
                    {row.original.status.replace(/-/g, " ")}
                </Badge>
            ),
        },
        {
            accessorKey: "enrolledAt",
            header: "Enrolled Date",
            cell: ({ row }) =>
                row.original.enrolledAt
                    ? new Date(row.original.enrolledAt).toLocaleDateString("en-US", { dateStyle: "medium" })
                    : "—",
        },
    ], []);

    const table = useReactTable({
        data: pageData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        manualFiltering: true,
        pageCount: totalPages,
        state: { pagination: { pageIndex, pageSize: PAGE_SIZE } },
    });

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <GraduationCap className="w-7 h-7 text-primary" />
                        Student Management
                    </h1>
                    <p className="text-muted-foreground">View students enrolled in your courses</p>
                </div>
            </div>

            {/* Stats */}
            {!coursesLoading && (
                <div className="grid grid-cols-2 gap-4">
                    {[
                        // { icon: BookOpen, label: "My Courses", value: courses.length,  color: "bg-emerald-500" },
                        { icon: Layers, label: "Batches", value: totalBatches, color: "bg-blue-500" },
                        { icon: Users, label: "Students", value: totalStudents, color: "bg-violet-500" },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <Card key={label}>
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={`p-2.5 rounded-lg ${color}`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                    <p className="text-xl font-bold">{value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Table Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Enrolled Students</CardTitle>
                    <CardDescription>Students across your assigned courses and batches</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    {/* Course tabs */}
                    {/* {coursesLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">Loading courses…</span>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Filter by course</p>
                            <Tabs
                                value={selectedCourseId}
                                onValueChange={v => { setSelectedCourseId(v); setPageIndex(0); }}
                            >
                                <TabsList className="h-auto min-h-12 w-full justify-start gap-2 overflow-x-auto overflow-y-hidden rounded-xl border border-primary/20 bg-muted/40 p-1.5">
                                    <TabsTrigger
                                        value="all"
                                        className="h-10 shrink-0 whitespace-nowrap rounded-lg border border-transparent px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-background/70 hover:text-foreground data-[state=active]:border-primary/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        All Courses
                                    </TabsTrigger>
                                    {courses.map(c => (
                                        <TabsTrigger
                                            key={c._id}
                                            value={c._id}
                                            className="h-10 shrink-0 whitespace-nowrap rounded-lg border border-transparent px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-background/70 hover:text-foreground data-[state=active]:border-primary/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                        >
                                            {c.title}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>
                    )} */}

                    {/* Search + Filters */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Input
                            placeholder="Search by name or email…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full sm:max-w-sm"
                        />
                        <div className="flex flex-col gap-3 sm:flex-row">
                            {/* Batch select */}
                            <Select
                                value={selectedBatchId}
                                onValueChange={v => { setSelectedBatchId(v); setPageIndex(0); }}
                            >
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Filter by batch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Batches</SelectItem>
                                    {courseBatches.map((b: any) => (
                                        <SelectItem key={b._id} value={b._id}>
                                            {b.title || `Batch #${b.batchNumber}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Status select */}
                            <Select
                                value={statusFilter}
                                onValueChange={v => { setStatusFilter(v); setPageIndex(0); }}
                            >
                                <SelectTrigger className="w-full sm:w-[160px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Suspended">Suspended</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    {studentsLoading ? (
                        <div className="flex items-center justify-center h-48">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : !singleBatchId ? (
                        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                            Select a batch to view students.
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map(hg => (
                                        <TableRow key={hg.id}>
                                            {hg.headers.map(h => (
                                                <TableHead
                                                    key={h.id}
                                                    onClick={h.column.getToggleSortingHandler()}
                                                    className="cursor-pointer select-none"
                                                >
                                                    {flexRender(h.column.columnDef.header, h.getContext())}
                                                    {h.column.getIsSorted() === "asc" ? " 🔼"
                                                        : h.column.getIsSorted() === "desc" ? " 🔽"
                                                            : null}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows.length ? (
                                        table.getRowModel().rows.map(row => (
                                            <TableRow key={row.id} className="hover:bg-muted/40 transition-colors">
                                                {row.getVisibleCells().map(cell => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                                                No students found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-sm text-muted-foreground">
                                    Showing {pageData.length} of {filtered.length} student{filtered.length !== 1 ? "s" : ""}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline" size="sm"
                                        onClick={() => setPageIndex(p => Math.max(p - 1, 0))}
                                        disabled={pageIndex === 0}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm">Page {pageIndex + 1} of {totalPages}</span>
                                    <Button
                                        variant="outline" size="sm"
                                        onClick={() => setPageIndex(p => Math.min(p + 1, totalPages - 1))}
                                        disabled={pageIndex >= totalPages - 1}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}