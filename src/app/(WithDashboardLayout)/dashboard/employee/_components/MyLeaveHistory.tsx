'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import {
    CalendarDays, CheckCircle2, XCircle,
    Clock, Plus,
} from 'lucide-react';
import { useGetMyLeaveRequestsQuery } from '@/redux/api/employeeApi';
import type { LeaveRequest } from '@/redux/api/employeeApi';
import { DataTable } from '@/components/ui/data-table';
import { CardIconHeader } from './shared';

function daysBetween(from: string, to: string) {
    return Math.max(1, Math.round(
        (new Date(to).getTime() - new Date(from).getTime()) / 86400000
    ) + 1);
}

const STATUS_BADGE: Record<LeaveRequest['status'], string> = {
    Pending:  'bg-amber-100 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Rejected: 'bg-red-100 text-red-600 border-red-200',
};

interface Props {
    onApplyClick: () => void;
}

export function MyLeaveHistory({ onApplyClick }: Props) {
    const { data, isLoading, isError } = useGetMyLeaveRequestsQuery({ page: 1, limit: 10 });
    const requests = data?.data?.requests ?? [];

    const columns = useMemo<ColumnDef<LeaveRequest>[]>(() => [
        { accessorKey: "type", header: "Type", cell: ({ row }) => <Badge variant="secondary">{row.original.type}</Badge> },
        { id: "duration", header: "Duration", cell: ({ row }) => <span className="text-sm text-gray-600 whitespace-nowrap">{new Date(row.original.from).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} → {new Date(row.original.to).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span> },
        { id: "days", header: "Days", cell: ({ row }) => <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-xs font-bold mx-auto">{daysBetween(row.original.from, row.original.to)}</span> },
        { accessorKey: "reason", header: "Reason", cell: ({ row }) => <p className="text-sm text-gray-600 max-w-[200px] truncate" title={row.original.reason}>{row.original.reason}</p> },
        { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge className={`gap-1 ${STATUS_BADGE[row.original.status]}`}>{row.original.status === 'Pending' && <Clock className="w-3 h-3" />}{row.original.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}{row.original.status === 'Rejected' && <XCircle className="w-3 h-3" />}{row.original.status}</Badge> },
        { accessorKey: "createdAt", header: "Applied On", cell: ({ row }) => <span className="text-sm text-gray-500 whitespace-nowrap">{new Date(row.original.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span> },
    ], []);

    return (
        <Card className="shadow-sm border-0 ring-1 ring-gray-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b pb-4">
                <div className="flex items-center justify-between">
                    <CardIconHeader
                        icon={CalendarDays}
                        title="My Leave Requests"
                        bgColor="bg-violet-500"
                    />
                    <Button
                        size="sm"
                        onClick={onApplyClick}
                        className="gap-2"
                        id="apply-leave-btn"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Apply for Leave
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
                {isError ? (
                    <div className="flex items-center justify-center h-36 gap-2 text-destructive">
                        <span className="text-sm">Failed to load leave requests</span>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={requests}
                        getRowId={(r) => r._id}
                        isLoading={isLoading}
                        emptyState={
                            <div className="flex flex-col items-center justify-center h-36 gap-2 text-muted-foreground">
                                <CalendarDays className="w-8 h-8 opacity-30" />
                                <p className="text-sm">No leave requests yet.</p>
                                <Button variant="outline" size="sm" onClick={onApplyClick} className="gap-1.5 mt-1">
                                    <Plus className="w-3.5 h-3.5" /> Apply for Leave
                                </Button>
                            </div>
                        }
                    />
                )}
            </CardContent>
        </Card>
    );
}
