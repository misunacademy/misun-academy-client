'use client';

import { useState, useMemo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useGetAllLeaveRequestsAdminQuery, useUpdateLeaveStatusMutation } from '@/redux/api/employeeAdminApi';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LeaveRequest } from '@/redux/api/employeeApi';

function daysBetween(from: string, to: string) {
    return Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1);
}

export function LeaveManagementTab() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const limit = 10;

    const { data, isLoading, isFetching } = useGetAllLeaveRequestsAdminQuery({
        page, limit,
        status: statusFilter !== 'all' ? statusFilter : undefined,
    });

    const [updateLeave] = useUpdateLeaveStatusMutation();

    const requests = data?.data?.requests ?? [];
    const total = data?.data?.total ?? 0;
    const totalPages = data?.data?.totalPages ?? 1;

    const handleAction = useCallback(async (req: LeaveRequest, action: 'Approved' | 'Rejected') => {
        setUpdatingId(req._id);
        try {
            await updateLeave({ id: req._id, status: action }).unwrap();
            toast.success(`Leave ${action.toLowerCase()} successfully`);
        } catch {
            toast.error(`Failed to ${action.toLowerCase()} leave`);
        } finally {
            setUpdatingId(null);
        }
    }, [updateLeave]);

    const columns = useMemo<ColumnDef<LeaveRequest>[]>(() => [
        { accessorKey: "employeeName", header: "Employee", cell: ({ row }) => <span className="font-medium">{row.original.employeeName}</span> },
        { accessorKey: "type", header: "Type", cell: ({ row }) => <Badge variant="secondary">{row.original.type}</Badge> },
        { id: "duration", header: "Duration", cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{new Date(row.original.from).toLocaleDateString()} → {new Date(row.original.to).toLocaleDateString()}</span> },
        { id: "days", header: "Days", cell: ({ row }) => <span className="text-sm text-center block">{daysBetween(row.original.from, row.original.to)}</span> },
        { accessorKey: "reason", header: "Reason", cell: ({ row }) => <p className="text-sm text-muted-foreground max-w-[180px] truncate" title={row.original.reason}>{row.original.reason}</p> },
        { accessorKey: "status", header: "Status", cell: ({ row }) => (
            <Badge variant={row.original.status === 'Approved' ? 'default' : row.original.status === 'Rejected' ? 'destructive' : 'secondary'} className="gap-1">
                {row.original.status === 'Pending' && <Clock className="w-3 h-3" />}
                {row.original.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                {row.original.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                {row.original.status}
            </Badge>
        )},
        { accessorKey: "createdAt", header: "Applied", cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{new Date(row.original.createdAt).toLocaleDateString()}</span> },
        { id: "actions", header: "Actions", cell: ({ row }) => {
            const req = row.original
            const isPending = req.status === 'Pending'
            const isUpdating = updatingId === req._id
            return isPending ? (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="default" onClick={() => handleAction(req, 'Approved')} disabled={!!updatingId} className="gap-1 h-7 px-2.5 text-xs">
                        {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                        Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleAction(req, 'Rejected')} disabled={!!updatingId} className="gap-1 h-7 px-2.5 text-xs">
                        {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                        Reject
                    </Button>
                </div>
            ) : <span className="text-xs text-muted-foreground">—</span>
        }},
    ], [handleAction, updatingId])

    return (
        <DataTable
            heading="Employee Leave Requests"
            subheading="Here you can manage employee leave requests"
            filters={
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4 justify-end items-center">
                        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Requests</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            }
            columns={columns}
            data={requests}
            getRowId={(r) => r._id}
            isLoading={isLoading}
            isFetching={isFetching}
            emptyState="No leave requests found."
            pagination={{ page, totalPages, total, limit, onPageChange: setPage }}
        />
    );
}
