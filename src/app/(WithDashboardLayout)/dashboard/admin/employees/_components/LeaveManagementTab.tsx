'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useGetAllLeaveRequestsAdminQuery, useUpdateLeaveStatusMutation } from '@/redux/api/employeeAdminApi';
import DashboardPageTableWithPagination from '@/components/layout/DashboardPageTableWithPagination';
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

    const handleAction = async (req: LeaveRequest, action: 'Approved' | 'Rejected') => {
        setUpdatingId(req._id);
        try {
            await updateLeave({ id: req._id, status: action }).unwrap();
            toast.success(`Leave ${action.toLowerCase()} successfully`);
        } catch {
            toast.error(`Failed to ${action.toLowerCase()} leave`);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <DashboardPageTableWithPagination
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
            columns={['Employee', 'Type', 'Duration', 'Days', 'Reason', 'Status', 'Applied', 'Actions']}
            data={requests}
            getRowKey={(r) => r._id}
            isLoading={isLoading}
            isFetching={isFetching}
            emptyState="No leave requests found."
            renderRow={(req) => {
                const isPending = req.status === 'Pending';
                const isUpdating = updatingId === req._id;
                return (
                    <>
                        <TableCell className="font-medium">{req.employeeName}</TableCell>
                        <TableCell>
                            <Badge variant="secondary">{req.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(req.from).toLocaleDateString()} → {new Date(req.to).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-center">
                            {daysBetween(req.from, req.to)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[180px]">
                            <p className="truncate" title={req.reason}>{req.reason}</p>
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant={
                                    req.status === 'Approved' ? 'default'
                                        : req.status === 'Rejected' ? 'destructive'
                                            : 'secondary'
                                }
                                className="gap-1"
                            >
                                {req.status === 'Pending' && <Clock className="w-3 h-3" />}
                                {req.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                                {req.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                                {req.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(req.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => handleAction(req, 'Approved')}
                                        disabled={!!updatingId}
                                        className="gap-1 h-7 px-2.5 text-xs"
                                    >
                                        {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleAction(req, 'Rejected')}
                                        disabled={!!updatingId}
                                        className="gap-1 h-7 px-2.5 text-xs"
                                    >
                                        {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                        Reject
                                    </Button>
                                </div>
                            ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                            )}
                        </TableCell>
                    </>
                );
            }}
            pagination={{ page, totalPages, total, limit, onPageChange: setPage }}
        />
            );
}
