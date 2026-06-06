'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    CalendarDays, CheckCircle2, XCircle,
    Clock, Plus, Loader2,
} from 'lucide-react';
import { useGetMyLeaveRequestsQuery } from '@/redux/api/employeeApi';
import type { LeaveRequest } from '@/redux/api/employeeApi';
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
    const { data, isLoading } = useGetMyLeaveRequestsQuery({ page: 1, limit: 10 });
    const requests = data?.data?.requests ?? [];

    return (
        <Card className="shadow-sm border-0 ring-1 ring-gray-100 overflow-hidden">
            {/* Header */}
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
                {isLoading ? (
                    <div className="flex items-center justify-center h-36 gap-2 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Loading leave requests…</span>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-36 gap-2 text-muted-foreground">
                        <CalendarDays className="w-8 h-8 opacity-30" />
                        <p className="text-sm">No leave requests yet.</p>
                        <Button variant="outline" size="sm" onClick={onApplyClick} className="gap-1.5 mt-1">
                            <Plus className="w-3.5 h-3.5" /> Apply for Leave
                        </Button>
                    </div>
                ) : (
                    <Table className="min-w-[560px]">
                        <TableHeader>
                            <TableRow className="bg-gray-50/60">
                                <TableHead>Type</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead className="text-center">Days</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Applied On</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((req) => (
                                <TableRow key={req._id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="whitespace-nowrap">
                                        <Badge variant="secondary">{req.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                                        {new Date(req.from).toLocaleDateString('en-GB', {
                                            day: '2-digit', month: 'short',
                                        })}
                                        {' → '}
                                        {new Date(req.to).toLocaleDateString('en-GB', {
                                            day: '2-digit', month: 'short', year: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-xs font-bold">
                                            {daysBetween(req.from, req.to)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600 max-w-[200px]">
                                        <p className="truncate" title={req.reason}>{req.reason}</p>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <Badge className={`gap-1 ${STATUS_BADGE[req.status]}`}>
                                            {req.status === 'Pending'  && <Clock       className="w-3 h-3" />}
                                            {req.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                                            {req.status === 'Rejected' && <XCircle      className="w-3 h-3" />}
                                            {req.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(req.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit', month: 'short', year: 'numeric',
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
