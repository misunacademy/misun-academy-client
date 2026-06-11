'use client';

import { useState } from 'react';
import { useGetMyLeaveRequestsQuery } from '@/redux/api/employeeApi';
import type { LeaveRequest } from '@/redux/api/employeeApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    CalendarDays, CheckCircle2, XCircle,
    Clock, Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DashboardPageTableWithPagination from '@/components/layout/DashboardPageTableWithPagination';
import { LeaveRequestDialog } from '../(components)/LeaveRequestDialog';

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

// ─── Summary stat card ────────────────────────────────────────────────────────
function StatCard({
    label, value, sub,
}: {
    label: string;
    value: string | number;
    sub?: string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
            </CardContent>
        </Card>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const LeavePage = () => {
    const [page, setPage]                 = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dialogOpen, setDialogOpen]     = useState(false);
    const limit = 10;

    // Fetch all for stats (small limit is fine — employee won't have thousands)
    const { data: allData } = useGetMyLeaveRequestsQuery({ limit: 200 });

    // Fetch paginated + filtered for table
    const { data, isLoading, isFetching } = useGetMyLeaveRequestsQuery({
        page,
        limit,
        ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
    });

    const allRequests = allData?.data?.requests ?? [];
    const pending     = allRequests.filter((r) => r.status === 'Pending').length;
    const approved    = allRequests.filter((r) => r.status === 'Approved').length;
    const totalDaysApproved = allRequests
        .filter((r) => r.status === 'Approved')
        .reduce((acc, r) => acc + daysBetween(r.from, r.to), 0);

    const requests   = data?.data?.requests   ?? [];
    const total      = data?.data?.total      ?? 0;
    const totalPages = data?.data?.totalPages ?? 1;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* ── Page header ─────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Leave Management</h1>
                    <p className="text-muted-foreground">Apply for leave and track all your requests.</p>
                </div>
                <Button onClick={() => setDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Apply for Leave
                </Button>
            </div>

            {/* ── Stats ───────────────────────────────────────── */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Requests"   value={allRequests.length} sub="All time" />
                <StatCard label="Pending"          value={pending}            sub="Awaiting review" />
                <StatCard label="Approved"         value={approved}           sub="Approved by admin" />
                <StatCard label="Approved Days"    value={totalDaysApproved}  sub="Total leave days taken" />
            </div>

            {/* ── Table ───────────────────────────────────────── */}
            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <CardTitle>My Leave Requests</CardTitle>
                            <CardDescription>All your leave applications and their current status.</CardDescription>
                        </div>
                        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Requests</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
            </Card>

            <DashboardPageTableWithPagination
                columns={['Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Applied On']}
                data={requests}
                getRowKey={(r) => r._id}
                isLoading={isLoading}
                isFetching={isFetching}
                emptyState={
                    <div className="flex flex-col items-center gap-3 py-4">
                        <CalendarDays className="w-8 h-8 text-muted-foreground opacity-40" />
                        <p className="text-sm text-muted-foreground">No leave requests found.</p>
                        <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)} className="gap-2">
                            <Plus className="w-3.5 h-3.5" /> Apply for Leave
                        </Button>
                    </div>
                }
                renderRow={(req) => (
                    <>
                        <TableCell>
                            <Badge variant="secondary">{req.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(req.from).toLocaleDateString('en-GB', {
                                day: '2-digit', month: 'short', year: 'numeric',
                            })}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(req.to).toLocaleDateString('en-GB', {
                                day: '2-digit', month: 'short', year: 'numeric',
                            })}
                        </TableCell>
                        <TableCell className="text-sm text-center font-semibold">
                            {daysBetween(req.from, req.to)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                            <p className="truncate" title={req.reason}>{req.reason}</p>
                        </TableCell>
                        <TableCell>
                            <Badge className={`gap-1 ${STATUS_BADGE[req.status]}`}>
                                {req.status === 'Pending'  && <Clock        className="w-3 h-3" />}
                                {req.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                                {req.status === 'Rejected' && <XCircle      className="w-3 h-3" />}
                                {req.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(req.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit', month: 'short', year: 'numeric',
                            })}
                        </TableCell>
                    </>
                )}
                pagination={{ page, totalPages, total, limit, onPageChange: setPage }}
            />

            {/* ── Dialog ──────────────────────────────────────── */}
            <LeaveRequestDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </div>
    );
};

export default LeavePage;
