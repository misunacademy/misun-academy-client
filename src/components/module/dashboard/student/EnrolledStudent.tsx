'use client';
import { useState, useMemo } from "react";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnDef,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetEnrolledStudentsQuery } from "@/redux/features/student/studentApi";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

// Define the shape of a student data object
interface Student {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface Batch {
    _id: string;
    title: string;
}

interface Course {
    _id: string;
    title: string;
    slug: string;
}

interface StudentData {
    _id: string;
    student: Student | null;
    studentId: string;
    batch: Batch | null;
    course: Course | null;
    status: string;
    createdAt: string;
}

const EnrolledStudentTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // RTK Query params for fetching students
    const { data, isLoading, isError } = useGetEnrolledStudentsQuery({
        page,
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
    });

    const students = data?.data || [];
    const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

    const columns = useMemo<ColumnDef<StudentData>[]>(
        () => [
            {
                accessorKey: "studentId",
                header: "Student ID",
                cell: ({ row }) => row.original.studentId || 'N/A',
            },
            {
                accessorKey: "name",
                header: "Name",
                cell: ({ row }) => row.original.student?.name || 'N/A',
            },
            {
                accessorKey: "email",
                header: "Email",
                cell: ({ row }) => row.original.student?.email || 'N/A',
            },
            {
                accessorKey: "phone",
                header: "Phone",
                cell: ({ row }) => row.original.student?.phone || 'N/A',
            },
            {
                accessorKey: "course",
                header: "Course",
                cell: ({ row }) => row.original.course?.title || 'N/A',
            },
            {
                accessorKey: "batch",
                header: "Batch",
                cell: ({ row }) => row.original.batch?.title || 'N/A',
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const status = row.original.status;
                    return <Badge variant={(status === 'success') ? "default" : status === "failed" ? "destructive" : "outline"}>{status}</Badge>;
                },
            },
            {
                accessorKey: "createdAt",
                header: "Enrolled Date",
                cell: ({ row }) =>
                    new Date(row.original.createdAt).toLocaleDateString(),
            },
        ],
        []
    );

    const table = useReactTable({
        data: students,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter: search,
            pagination: { pageIndex: page - 1, pageSize: meta.limit },
        },
        // onSortingChange: setSorting,
        onGlobalFilterChange: setSearch,
        manualPagination: true,
        pageCount: meta.totalPages,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-red-600 text-lg">Error fetching students</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>All Students</CardTitle>
                    <CardDescription>View and manage all enrolled students</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between mb-4">
                        <Input
                            placeholder="Search students..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-sm"
                        />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="cursor-pointer"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getIsSorted() ? (
                                                header.column.getIsSorted() === 'asc' ? (
                                                    <span className="ml-1">🔼</span>
                                                ) : (
                                                    <span className="ml-1">🔽</span>
                                                )
                                            ) : null}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
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
                                    <TableCell colSpan={columns.length} className="text-center py-4 text-gray-500">
                                        No results found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex items-center justify-between mt-8">
                        <div>
                            Showing {table.getRowModel().rows.length} of {meta.total} students
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="border-gray-300"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span>
                                Page {page} of {meta.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
                                disabled={page === meta.totalPages}
                                className="border-gray-300"
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

export default EnrolledStudentTable;