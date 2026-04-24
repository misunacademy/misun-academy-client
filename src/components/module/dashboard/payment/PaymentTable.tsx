/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnDef,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PaymentResponse } from '@/redux/api/paymentApi';
import { useGetAllPaymentsQuery, useUpdatePaymentStatusMutation, useVerifyManualPaymentMutation } from '@/redux/api/paymentApi';
import { useGetAllCoursesQuery } from '@/redux/api/courseApi';
import { useGetAllBatchesQuery } from '@/redux/api/batchApi';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';


const PaymentTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCourseId, setSelectedCourseId] = useState('all');
    const [selectedBatchId, setSelectedBatchId] = useState('all');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

    const { data: coursesData } = useGetAllCoursesQuery({});
    const { data: batchesData } = useGetAllBatchesQuery({
        courseId: selectedCourseId !== 'all' ? selectedCourseId : undefined,
    });
    const courses = coursesData?.data || [];
    const batches = batchesData?.data || [];

    useEffect(() => {
        setPage(1);
    }, [search, statusFilter, selectedCourseId, selectedBatchId]);

    // RTK Query hooks
    const paymentsQueryParams: any = {
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        courseId: selectedCourseId !== 'all' ? selectedCourseId : undefined,
        batchId: selectedBatchId !== 'all' ? selectedBatchId : undefined,
    };
    if (page > 1) paymentsQueryParams.page = page;
    const paramsToSend = Object.keys(paymentsQueryParams).length ? paymentsQueryParams : undefined;

    const { data, isLoading, isError, refetch } = useGetAllPaymentsQuery(paramsToSend);
    const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
    const [verifyManualPayment] = useVerifyManualPaymentMutation();

    const payments = useMemo(() => data?.data || [], [data]);
    const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

    const handleConfirmStatusChange = useCallback(async () => {

        if (selectedTransactionId && selectedStatus) {
            try {
                // Find the payment to determine the method
                const payment = payments.find((p: any) => p.transactionId === selectedTransactionId);

                if (payment?.method === 'PhonePay' && payment.status === 'review') {
                    // For manual payments in review/pending status, use verify endpoint
                    const approved = selectedStatus === 'success';
                    await verifyManualPayment({ transactionId: selectedTransactionId, approved }).unwrap();
                    toast.success(approved ? 'Payment approved successfully' : 'Payment rejected');
                } else {
                    // For other payments, use general status update
                    await updatePaymentStatus({ transactionId: selectedTransactionId, status: selectedStatus }).unwrap();
                    toast.success('Payment status updated successfully');
                }
                refetch();
            } catch (error) {
                console.log(error)
                toast.error('Failed to update payment status');
            }
        }
        setOpenDialog(false);
        setSelectedStatus(null);
        setSelectedTransactionId(null);
    }, [selectedTransactionId, selectedStatus, updatePaymentStatus, verifyManualPayment, refetch, payments]);

    const columns = useMemo<ColumnDef<PaymentResponse>[]>(
        () => [
            {
                accessorKey: 'transactionId',
                header: 'Transaction ID',
                cell: ({ row }) => row.original.transactionId,
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                cell: ({ row }) => `${row.original.amount.toFixed(2)}`,
            },

            {
                accessorKey: 'method',
                header: 'Method',
                cell: ({ row }) => row.original.method,
            },
            {
                accessorFn: (row) => row.student ?.name ,
                id: 'student.name',
                header: 'Student',
                cell: ({ row }) => {
                    return <div>
                        <p>{row.original.student?.name || 'N/A'}</p>
                        <p className='text-[12px]'>{row.original.student?.email || 'N/A'}</p>
                    </div>
                }
            },
            {
                accessorFn: (row) => row.course?.title,
                id: 'course.title',
                header: 'Course',
                cell: ({ row }) => {
                    return <div>
                        <p className='font-medium'>{row.original.course?.title || 'N/A'}</p>
                        {/* {row.original.course?.slug && (
                            <p className='text-[12px] text-gray-500'>{row.original.course.slug}</p>
                        )} */}
                    </div>
                }
            },
            {
                accessorFn: (row) => row.batch?.title,
                id: 'batch.title',
                header: 'Batch',
                cell: ({ row }) => {
                    return <div>
                        <p className='font-medium'>{row.original.batch?.title || 'N/A'}</p>
                        {/* {row.original.batch?.batchNumber && (
                            <p className='text-[12px] text-gray-500'>Code: {row.original.batch.title.split(' ')[1]}</p>
                        )} */}
                    </div>
                }
            },
            {
                accessorFn: (row) => row.gatewayResponse,
                id: 'gatewayResponse',
                header: 'Payment Info',
                cell: ({ row }) => {
                    return <div>
                        {
                            (row.original.method === 'PhonePay' && row.original.gatewayResponse) && (
                                <div>
                                    <p className='text-[12px] font-bold'>{row.original?.gatewayResponse?.senderNumber}</p>
                                    <p>{row.original?.gatewayResponse?.phonePeTransactionId}</p>
                                </div>
                            )
                        }
                        {
                            (row.original.method === 'SSLCommerz' && row.original.gatewayResponse) && (
                                <div>
                                    <p className='text-[12px] font-bold'>{row.original?.gatewayResponse?.card_issuer}</p>
                                    <p>{row.original?.gatewayResponse?.bank_tran_id}</p>
                                </div>
                            )
                        }
                    </div>
                },
            },
            {
                accessorKey: 'createdAt',
                header: 'Payment Date',
                cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const status = row.original.status;
                    const transactionId = row.original.transactionId;

                    const handleStatusChange = (newStatus: string) => {
                        if (newStatus !== status) {
                            setSelectedStatus(newStatus);
                            setSelectedTransactionId(transactionId);
                            setOpenDialog(true);
                        }
                    };

                    return (
                        <>
                            <Select
                                value={status}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger className="w-[120px]">
                                    <Badge
                                        variant={
                                            status === 'success'
                                                ? 'default'
                                                : status === 'failed'
                                                    ? 'destructive'
                                                    : status === 'pending'
                                                        ? 'secondary'
                                                        : status === 'review'
                                                            ? 'outline'
                                                            : 'outline'
                                        }
                                        className="capitalize w-full justify-center"
                                    >
                                        {status}
                                    </Badge>
                                </SelectTrigger>
                                <SelectContent>
                                    {/* For manual payments in review, only show approve/reject options */}
                                    {row.original.method === 'PhonePay' && status === 'review' ? (
                                        <>
                                            <SelectItem value="success">Approve</SelectItem>
                                            <SelectItem value="failed">Reject</SelectItem>
                                        </>
                                    ) : (
                                        <>
                                            <SelectItem value="success">Success</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="failed">Failed</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                            <AlertDialog open={openDialog && selectedTransactionId === transactionId} onOpenChange={setOpenDialog}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to update the status to{' '}
                                            <span className="capitalize font-semibold">{selectedStatus}</span>?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setOpenDialog(false)}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleConfirmStatusChange}>Confirm</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    );
                },
            },
        ],
        [openDialog, selectedTransactionId, selectedStatus, handleConfirmStatusChange]
    );

    const table = useReactTable({
        data: payments,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter: search,
            pagination: { pageIndex: page - 1, pageSize: meta.limit },
        },
        onGlobalFilterChange: setSearch,
        manualPagination: true,
        pageCount: meta.totalPages,
    });

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 flex justify-center items-center h-64">
                <div className="text-gray-600 text-lg">Loading payments...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto p-4 flex justify-center items-center h-64">
                <div className="text-red-600 text-lg">Error fetching payments. Please try again later.</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>All Payments</CardTitle>
                    <CardDescription>View and manage all payment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Filter by course</p>
                        <Tabs
                            value={selectedCourseId}
                            onValueChange={(value) => {
                                setSelectedCourseId(value);
                                setSelectedBatchId('all');
                            }}
                        >
                            <TabsList className="h-auto min-h-12 w-full justify-start gap-2 overflow-x-auto overflow-y-hidden rounded-xl border border-primary/25 bg-muted/40 p-1.5">
                                <TabsTrigger
                                    value="all"
                                    className="h-10 shrink-0 whitespace-nowrap rounded-lg border border-transparent px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-background/70 hover:text-foreground data-[state=active]:border-primary/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_0_1px_hsl(var(--primary)/0.35),0_10px_24px_hsl(var(--primary)/0.35)]"
                                >
                                    All Courses
                                </TabsTrigger>
                                {courses.map((course) => (
                                    <TabsTrigger
                                        key={course._id}
                                        value={course._id}
                                        className="h-10 shrink-0 whitespace-nowrap rounded-lg border border-transparent px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-background/70 hover:text-foreground data-[state=active]:border-primary/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_0_1px_hsl(var(--primary)/0.35),0_10px_24px_hsl(var(--primary)/0.35)]"
                                    >
                                        {course.title}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input
                            placeholder="Search payments..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:max-w-sm"
                            aria-label="Search payments"
                        />
                        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                            <Select
                                value={selectedBatchId}
                                onValueChange={setSelectedBatchId}
                            >
                                <SelectTrigger className="w-full sm:w-[230px]">
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

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="success">Success</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="review">Review</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg shadow">
                        <Table className="min-w-full">
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="cursor-pointer"
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
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
                                        <TableRow
                                            key={row.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
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
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <div className="text-gray-600">
                            Showing {table.getRowModel().rows.length} of {meta.total} payments
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="border-gray-300"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-gray-600">
                                Page {page} of {meta.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
                                disabled={page === meta.totalPages}
                                className="border-gray-300"
                                aria-label="Next page"
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

export default PaymentTable;