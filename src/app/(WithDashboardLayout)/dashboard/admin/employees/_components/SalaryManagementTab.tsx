'use client';

import { useState, useMemo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Plus, CheckCircle, Clock, MoreHorizontal, Gift, Pencil, Trash2 } from 'lucide-react';
import {
    useGetAllSalariesAdminQuery,
    useUpdateSalaryStatusMutation,
    useDeleteSalaryMutation,
} from '@/redux/api/employeeAdminApi';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { AddSalaryDialog } from './AddSalaryDialog';
import { EditSalaryDialog } from './EditSalaryDialog';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Salary } from '@/redux/api/employeeApi';

export function SalaryManagementTab() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [addOpen, setAddOpen] = useState(false);
    const [editSalary, setEditSalary] = useState<Salary | null>(null);
    const [deleteSalary, setDeleteSalary] = useState<Salary | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const limit = 10;

    const { data, isLoading, isFetching } = useGetAllSalariesAdminQuery({
        page, limit,
        status: statusFilter !== 'all' ? statusFilter : undefined,
    });

    const [updateStatus] = useUpdateSalaryStatusMutation();
    const [deleteSalaryMutation] = useDeleteSalaryMutation();

    const salaries = data?.data?.salaries ?? [];
    const total = data?.data?.total ?? 0;
    const totalPages = data?.data?.totalPages ?? 1;

    const handleToggle = useCallback(async (s: Salary) => {
        const next = s.status === 'Paid' ? 'Pending' : 'Paid';
        setUpdatingId(s._id);
        try {
            await updateStatus({ id: s._id, status: next }).unwrap();
            toast.success(`Marked as ${next}`);
        } catch {
            toast.error('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    }, [updateStatus]);

    const handleDelete = async () => {
        if (!deleteSalary) return;
        setDeletingId(deleteSalary._id);
        try {
            await deleteSalaryMutation(deleteSalary._id).unwrap();
            toast.success('Salary record deleted.');
        } catch {
            toast.error('Failed to delete salary record.');
        } finally {
            setDeletingId(null);
            setDeleteSalary(null);
        }
    };

    const columns = useMemo<ColumnDef<Salary>[]>(() => [
        { accessorKey: "employeeName", header: "Employee", cell: ({ row }) => <span className="font-medium">{row.original.employeeName}</span> },
        { accessorKey: "jobTitle", header: "Job Title", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.jobTitle}</span> },
        { id: "period", header: "Period", cell: ({ row }) => <span className="text-sm">{row.original.month} {row.original.year}</span> },
        { accessorKey: "amount", header: "Gross", cell: ({ row }) => <span className="text-sm">৳ {row.original.amount.toLocaleString()}</span> },
        { accessorKey: "bonus", header: "Bonus", cell: ({ row }) => row.original.bonus ? <span className="flex items-center gap-1"><Gift className="w-3.5 h-3.5 text-muted-foreground" />৳ {row.original.bonus.toLocaleString()}</span> : <span>—</span> },
        { accessorKey: "totalAmount", header: "Total", cell: ({ row }) => <span className="font-semibold">৳ {row.original.totalAmount.toLocaleString()}</span> },
        { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={row.original.status === 'Paid' ? 'default' : 'secondary'} className="gap-1">{row.original.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}{row.original.status}</Badge> },
        { accessorKey: "paymentDate", header: "Payment Date", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.paymentDate ? new Date(row.original.paymentDate).toLocaleDateString() : '—'}</span> },
        { id: "actions", header: "Action", cell: ({ row }) => {
            const s = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            {updatingId === s._id || deletingId === s._id
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <MoreHorizontal className="w-4 h-4" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleToggle(s)} disabled={!!updatingId || !!deletingId} className="gap-2">
                            {s.status === 'Paid' ? <><Clock className="w-4 h-4" /> Mark as Pending</> : <><CheckCircle className="w-4 h-4" /> Mark as Paid</>}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditSalary(s)} disabled={!!updatingId || !!deletingId} className="gap-2">
                            <Pencil className="w-4 h-4" /> Edit Record
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteSalary(s)} disabled={!!updatingId || !!deletingId} className="gap-2 text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4" /> Delete Record
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }},
    ], [handleToggle, setEditSalary, setDeleteSalary, updatingId, deletingId])

    return (
        <>
            <DataTable
                heading='Manage Employee Salary'
                subheading='Here you can manage employee salary'
                filters={
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-4 justify-end items-center">
                            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Salaries</SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={() => setAddOpen(true)} className="gap-2">
                                <Plus className="w-4 h-4" /> Add Salary Record
                            </Button>
                        </CardContent>
                    </Card>
                }
                columns={columns}
                data={salaries}
                getRowId={(s) => s._id}
                isLoading={isLoading}
                isFetching={isFetching}
                emptyState="No salary records found."
                pagination={{ page, totalPages, total, limit, onPageChange: setPage }}
            />

            <AddSalaryDialog open={addOpen} onClose={() => setAddOpen(false)} />
            <EditSalaryDialog key={editSalary?._id ?? 'edit'} open={!!editSalary} salary={editSalary} onClose={() => setEditSalary(null)} />
            <AlertDialog open={!!deleteSalary} onOpenChange={(o) => { if (!o) setDeleteSalary(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Salary Record?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the <strong>{deleteSalary?.month} {deleteSalary?.year}</strong> salary record
                            for <strong>{deleteSalary?.employeeName}</strong>. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={!!deletingId}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={!!deletingId} className="bg-destructive hover:bg-destructive/90 gap-2">
                            {deletingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            {deletingId ? 'Deleting…' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
