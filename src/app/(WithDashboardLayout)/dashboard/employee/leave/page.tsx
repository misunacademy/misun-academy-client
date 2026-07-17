'use client';

import { useState, useMemo } from 'react';
import { useGetMyLeaveRequestsQuery } from '@/redux/api/employeeApi';
import type { LeaveRequest } from '@/redux/api/employeeApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { ColumnDef } from '@tanstack/react-table';
import {
    CalendarDays, CheckCircle2, XCircle,
    Clock, Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { LeaveRequestDialog } from '../_components/LeaveRequestDialog';

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
            <DataTable
                heading="My Leave Requests"
                subheading="All your leave applications and their current status."
                filters={
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-end items-center">
                            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
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
                columns={useMemo<ColumnDef<LeaveRequest>[]>(() => [
                    { accessorKey: "type", header: "Type", cell: ({ row }) => <Badge variant="secondary">{row.original.type}</Badge> },
                    { accessorKey: "from", header: "From", cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{new Date(row.original.from).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span> },
                    { accessorKey: "to", header: "To", cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{new Date(row.original.to).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span> },
                    { id: "days", header: "Days", cell: ({ row }) => <span className="text-sm text-center font-semibold block">{daysBetween(row.original.from, row.original.to)}</span> },
                    { accessorKey: "reason", header: "Reason", cell: ({ row }) => <p className="text-sm text-muted-foreground max-w-[200px] truncate" title={row.original.reason}>{row.original.reason}</p> },
                    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge className={`gap-1 ${STATUS_BADGE[row.original.status]}`}>{row.original.status === 'Pending' && <Clock className="w-3 h-3" />}{row.original.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}{row.original.status === 'Rejected' && <XCircle className="w-3 h-3" />}{row.original.status}</Badge> },
                    { accessorKey: "createdAt", header: "Applied On", cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{new Date(row.original.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span> },
                ], [])}
                data={requests}
                getRowId={(r) => r._id}
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
                pagination={{ page, totalPages, total, limit, onPageChange: setPage }}
            />

            {/* ── Dialog ──────────────────────────────────────── */}
            <LeaveRequestDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </div>
    );
};

export default LeavePage;
