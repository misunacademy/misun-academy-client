'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
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
import { useGetAllPaymentsQuery, useUpdatePaymentStatusMutation, useVerifyManualPaymentMutation } from '@/redux/api/paymentApi';
import { useGetAllCoursesQuery } from '@/redux/api/courseApi';
import { useGetAllBatchesQuery } from '@/redux/api/batchApi';
import { toast } from 'sonner';
import PaymentFiltersCard from './PaymentFiltersCard';
import { usePaymentColumns } from './paymentColumns';
import { PaymentPagination } from './PaymentPagination';

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
    const batchesQueryParams = useMemo(() => ({
        courseId: selectedCourseId !== 'all' ? selectedCourseId : undefined,
    }), [selectedCourseId]);
    const { data: batchesData } = useGetAllBatchesQuery(batchesQueryParams);
    const courses = useMemo(() => coursesData?.data || [], [coursesData]);
    const batches = useMemo(() => batchesData?.data || [], [batchesData]);

    useEffect(() => { setPage(1); }, [search, statusFilter, selectedCourseId, selectedBatchId]);

    const paymentsQueryParams = useMemo(() => ({
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        courseId: selectedCourseId !== 'all' ? selectedCourseId : undefined,
        batchId: selectedBatchId !== 'all' ? selectedBatchId : undefined,
        page: page > 1 ? page : undefined,
    } as Record<string, string | number | undefined>), [search, statusFilter, selectedCourseId, selectedBatchId, page]);

    const { data, isLoading, isError, refetch } = useGetAllPaymentsQuery(paymentsQueryParams);
    const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
    const [verifyManualPayment] = useVerifyManualPaymentMutation();

    const payments = useMemo(() => data?.data || [], [data]);
    const meta = useMemo(() => data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }, [data?.meta]);

    const handleConfirmStatusChange = useCallback(async () => {
        if (selectedTransactionId && selectedStatus) {
            try {
                const payment = payments.find((p) => p.transactionId === selectedTransactionId);
                if (payment?.method === 'PhonePay' && payment.status === 'review') {
                    await verifyManualPayment({ transactionId: selectedTransactionId, approved: selectedStatus === 'success' }).unwrap();
                } else {
                    await updatePaymentStatus({ transactionId: selectedTransactionId, status: selectedStatus }).unwrap();
                }
                toast.success('Payment status updated successfully');
                refetch();
            } catch { toast.error('Failed to update payment status'); }
        }
        setOpenDialog(false);
        setSelectedStatus(null);
        setSelectedTransactionId(null);
    }, [selectedTransactionId, selectedStatus, payments, updatePaymentStatus, verifyManualPayment, refetch]);

    const columns = usePaymentColumns(openDialog, selectedTransactionId, selectedStatus, setSelectedStatus, setSelectedTransactionId, setOpenDialog, handleConfirmStatusChange);

    const handleCourseChange = useCallback((value: string) => {
        setSelectedCourseId(value);
        setSelectedBatchId('all');
    }, []);

    const handlePrevPage = useCallback(() => setPage((prev) => Math.max(prev - 1, 1)), []);
    const handleNextPage = useCallback(() => setPage((prev) => Math.min(prev + 1, meta.totalPages)), [meta.totalPages]);

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data: payments,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: { globalFilter: search, pagination: { pageIndex: page - 1, pageSize: meta.limit } },
        onGlobalFilterChange: setSearch,
        manualPagination: true,
        pageCount: meta.totalPages,
    });

    if (isLoading) return <div className="container mx-auto p-4 flex justify-center items-center h-64"><div className="text-gray-600 text-lg">Loading payments...</div></div>;
    if (isError) return <div className="container mx-auto p-4 flex justify-center items-center h-64"><div className="text-red-600 text-lg">Error fetching payments. Please try again later.</div></div>;

    return (
        <div className="space-y-6">
            <PaymentFiltersCard
                courses={courses} batches={batches}
                selectedCourseId={selectedCourseId} selectedBatchId={selectedBatchId}
                statusFilter={statusFilter} search={search}
                onSearchChange={setSearch} onCourseChange={handleCourseChange}
                onBatchChange={setSelectedBatchId} onStatusChange={setStatusFilter}
            />
            <Card>
                <CardHeader>
                    <CardTitle>All Payments</CardTitle>
                    <CardDescription>View and manage all payment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-lg shadow">
                        <Table className="min-w-full">
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()} className="cursor-pointer">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() === 'asc' ? <span className="ml-1">🔼</span> : header.column.getIsSorted() === 'desc' ? <span className="ml-1">🔽</span> : null}
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
                                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="text-center py-4 text-gray-500">No results found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <PaymentPagination page={page} totalPages={meta.totalPages} total={meta.total} rowCount={table.getRowModel().rows.length} onPrevPage={handlePrevPage} onNextPage={handleNextPage} />
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentTable;
