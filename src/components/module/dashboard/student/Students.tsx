/* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client'
// import { useEffect, useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { MoreVertical, Search, ArrowUpDown } from "lucide-react";
// import { toast } from "sonner";
// import { generateMockStudents, mockBatches } from "@/data/mockStudents";
// import { PaymentStatus, Student } from "@/types/common";
// import { PaymentStatusBadge } from "./PaymentStatusBadge";


// const PAGE_SIZES = [10, 20, 30, 50];

// type SortBy = keyof Pick<Student, "name" | "email" | "studentId">;

// type Params = {
//     search: string;
//     paymentStatus: "all" | PaymentStatus;
//     batch: "all" | string;
//     page: number;
//     limit: number;
//     sortBy: SortBy;
//     sortOrder: "asc" | "desc";
// };

// const defaultParams: Params = {
//     search: "",
//     paymentStatus: "all",
//     batch: "all",
//     page: 1,
//     limit: 10,
//     sortBy: "name",
//     sortOrder: "asc",
// };

// const Students = () => {
//     useEffect(() => {
//         document.title = "Students Dashboard – Manage Students";
//         const meta = document.querySelector('meta[name="description"]');
//         if (meta) meta.setAttribute("content", "Student management dashboard with search, filters, sorting, and pagination.");
//         const link = document.querySelector('link[rel="canonical"]') || document.createElement("link");
//         link.setAttribute("rel", "canonical");
//         link.setAttribute("href", window.location.href);
//         if (!link.parentElement) document.head.appendChild(link);
//     }, []);

//     const [students, setStudents] = useState<Student[]>(() => generateMockStudents(64));
//     const [params, setParams] = useState<Params>(defaultParams);

//     const filtered = useMemo(() => {
//         let data = [...students];
//         if (params.search) {
//             const q = params.search.toLowerCase();
//             data = data.filter((s) =>
//                 [s.name, s.email, s.studentId, s.phone, s.address].some((v) => v.toLowerCase().includes(q))
//             );
//         }
//         if (params.paymentStatus !== "all") {
//             data = data.filter((s) => s.paymentStatus === params.paymentStatus);
//         }
//         if (params.batch !== "all") {
//             data = data.filter((s) => s.batch.id === params.batch);
//         }
//         data.sort((a, b) => {
//             const va = a[params.sortBy].toString().toLowerCase();
//             const vb = b[params.sortBy].toString().toLowerCase();
//             if (va < vb) return params.sortOrder === "asc" ? -1 : 1;
//             if (va > vb) return params.sortOrder === "asc" ? 1 : -1;
//             return 0;
//         });
//         return data;
//     }, [students, params]);

//     const total = filtered.length;
//     const totalPages = Math.max(1, Math.ceil(total / params.limit));
//     const page = Math.min(params.page, totalPages);
//     const paged = useMemo(() => {
//         const start = (page - 1) * params.limit;
//         return filtered.slice(start, start + params.limit);
//     }, [filtered, page, params.limit]);

//     const setSort = (col: SortBy) => {
//         setParams((p) => ({
//             ...p,
//             sortBy: col,
//             sortOrder: p.sortBy === col && p.sortOrder === "asc" ? "desc" : "asc",
//             page: 1,
//         }));
//     };

//     const updatePaymentStatus = (id: string, status: PaymentStatus) => {
//         setStudents((prev) => prev.map((s) => (s._id === id ? { ...s, paymentStatus: status } : s)));
//         toast.success("Payment status updated");
//     };

//     const resetFilters = () => setParams(defaultParams);

//     return (
//         <main className="container py-8">
//             <header className="mb-6">
//                 <h1 className="text-3xl font-semibold">Student Management Dashboard</h1>
//                 <p className="text-muted-foreground mt-1">Search, filter, sort, and manage student payments.</p>
//             </header>

//             <Card className="mb-6 transition-smooth card-hover">
//                 <CardHeader>
//                     <CardTitle>Filters</CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid gap-4 md:grid-cols-5">
//                     <div className="md:col-span-2">
//                         <Label htmlFor="search" className="sr-only">Search</Label>
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                             <Input
//                                 id="search"
//                                 placeholder="Search by name, email, ID..."
//                                 value={params.search}
//                                 onChange={(e) => setParams({ ...params, search: e.target.value, page: 1 })}
//                                 className="pl-9"
//                             />
//                         </div>
//                     </div>
//                     <div>
//                         <Label className="mb-1 block">Payment status</Label>
//                         <Select value={params.paymentStatus} onValueChange={(v) => setParams({ ...params, paymentStatus: v as any, page: 1 })}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="All" />
//                             </SelectTrigger>
//                             <SelectContent className="z-50">
//                                 <SelectItem value="all">All</SelectItem>
//                                 <SelectItem value="pending">Pending</SelectItem>
//                                 <SelectItem value="success">Success</SelectItem>
//                                 <SelectItem value="failed">Failed</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <div>
//                         <Label className="mb-1 block">Batch</Label>
//                         <Select value={params.batch} onValueChange={(v) => setParams({ ...params, batch: v, page: 1 })}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="All batches" />
//                             </SelectTrigger>
//                             <SelectContent className="z-50">
//                                 <SelectItem value="all">All batches</SelectItem>
//                                 {mockBatches.map((b) => (
//                                     <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <div>
//                         <Label className="mb-1 block">Page size</Label>
//                         <Select value={String(params.limit)} onValueChange={(v) => setParams({ ...params, limit: Number(v), page: 1 })}>
//                             <SelectTrigger>
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="z-50">
//                                 {PAGE_SIZES.map((s) => (
//                                     <SelectItem key={s} value={String(s)}>{s} / page</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <div className="flex items-end">
//                         <Button variant="secondary" onClick={resetFilters} className="w-full">Reset</Button>
//                     </div>
//                 </CardContent>
//             </Card>

//             <Card className="transition-smooth card-hover">
//                 <CardHeader>
//                     <CardTitle>Students ({total})</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="w-full overflow-x-auto">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead className="cursor-pointer select-none" onClick={() => setSort("name")}>Name <ArrowUpDown className="inline h-4 w-4 ml-1" /></TableHead>
//                                     <TableHead className="cursor-pointer select-none" onClick={() => setSort("email")}>Email <ArrowUpDown className="inline h-4 w-4 ml-1" /></TableHead>
//                                     <TableHead className="cursor-pointer select-none" onClick={() => setSort("studentId")}>Student ID <ArrowUpDown className="inline h-4 w-4 ml-1" /></TableHead>
//                                     <TableHead>Batch</TableHead>
//                                     <TableHead>Phone</TableHead>
//                                     <TableHead>Status</TableHead>
//                                     <TableHead className="text-right">Actions</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {paged.map((s) => (
//                                     <TableRow key={s._id} className="hover:bg-muted/40">
//                                         <TableCell className="font-medium">{s.name}</TableCell>
//                                         <TableCell>{s.email}</TableCell>
//                                         <TableCell>{s.studentId}</TableCell>
//                                         <TableCell>{s.batch.name}</TableCell>
//                                         <TableCell>{s.phone}</TableCell>
//                                         <TableCell><PaymentStatusBadge status={s.paymentStatus} /></TableCell>
//                                         <TableCell className="text-right">
//                                             <DropdownMenu>
//                                                 <DropdownMenuTrigger asChild>
//                                                     <Button variant="ghost" size="icon" aria-label="Actions">
//                                                         <MoreVertical className="h-4 w-4" />
//                                                     </Button>
//                                                 </DropdownMenuTrigger>
//                                                 <DropdownMenuContent align="end" className="z-50">
//                                                     <DropdownMenuLabel>Update payment</DropdownMenuLabel>
//                                                     <DropdownMenuSeparator />
//                                                     <DropdownMenuItem onClick={() => updatePaymentStatus(s._id, "success")}>Mark as Success</DropdownMenuItem>
//                                                     <DropdownMenuItem onClick={() => updatePaymentStatus(s._id, "pending")}>Mark as Pending</DropdownMenuItem>
//                                                     <DropdownMenuItem onClick={() => updatePaymentStatus(s._id, "failed")}>Mark as Failed</DropdownMenuItem>
//                                                 </DropdownMenuContent>
//                                             </DropdownMenu>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>

//                     <div className="flex items-center justify-between mt-4">
//                         <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
//                         <div className="flex gap-2">
//                             <Button variant="outline" disabled={page === 1} onClick={() => setParams({ ...params, page: page - 1 })}>Previous</Button>
//                             <Button variant="outline" disabled={page === totalPages} onClick={() => setParams({ ...params, page: page + 1 })}>Next</Button>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </main>
//     );
// };

// export default Students;


"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import { Pagination } from "@/components/ui/pagination"; // Your pagination component
import { useGetEnrolledStudentsQuery } from "@/redux/features/student/studentApi";

const PAGE_SIZES = [10, 20, 30, 50];

const Students = () => {
    // Filter, sorting, pagination states
    const [search, setSearch] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading } = useGetEnrolledStudentsQuery({
        search,
        status: paymentStatus || undefined,
        page,
        limit,
        sortBy,
        sortOrder,
    });

    const students = data?.data || [];
  
    const totalPages = data?.meta?.totalPages || 1;
    const totalRecords = data?.meta?.total || 0;

    const canPrev = page > 1;
    const canNext = page < totalPages;

    const onLimitChange = (value: string) => {
        setLimit(Number(value));
        setPage(1); // reset to first page when limit changes
    };

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        placeholder="Search students..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-[240px]"
                    />
                    <Select
                        value={paymentStatus}
                        onValueChange={(value) => {
                            setPaymentStatus(value === 'all' ? "" : value);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Payment Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={sortBy}
                        onValueChange={(value) => {
                            setSortBy(value);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="studentId">Student ID</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={sortOrder}
                        onValueChange={(value: "asc" | "desc") => {
                            setSortOrder(value);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Order" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">Ascending</SelectItem>
                            <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Batch</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : students.length > 0 ? (
                            students.map((enrollment) => {
                                const studentName = (enrollment as any).user?.name || enrollment.userId || 'N/A';
                                const studentEmail = (enrollment as any).user?.email || 'N/A';
                                const studentId = enrollment.enrollmentId || enrollment.userId || enrollment._id;
                                const batchName = enrollment.batchId?.title || 'N/A';
                                const paymentStatus = enrollment.status || 'N/A';

                                return (
                                <TableRow key={enrollment._id}>
                                    <TableCell className="font-medium">{studentName}</TableCell>
                                    <TableCell>{studentEmail}</TableCell>
                                    <TableCell>{studentId}</TableCell>
                                    <TableCell>{batchName}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                paymentStatus === "completed" || paymentStatus === 'active'
                                                    ? "default"
                                                    : paymentStatus === "payment-pending" || paymentStatus === "pending"
                                                        ? "secondary"
                                                        : "destructive"
                                            }
                                        >
                                            {paymentStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        alert(`Edit student: ${studentName}`)
                                                    }
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        alert(
                                                            `Update payment status for: ${studentName}`
                                                        )
                                                    }
                                                >
                                                    Update Payment Status
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() =>
                                                        alert(`Delete student: ${studentName}`)
                                                    }
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )})
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                    No students found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {/* Pagination and page size selector */}
            <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-2">
                <div className="text-sm text-muted-foreground">
                    Showing page {page} of {totalPages} — total records: {totalRecords}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        disabled={!canPrev}
                        onClick={() => canPrev && setPage(page - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        disabled={!canNext}
                        onClick={() => canNext && setPage(page + 1)}
                    >
                        Next
                    </Button>

                    <Select value={String(limit)} onValueChange={onLimitChange}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZES.map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size} / page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default Students;

