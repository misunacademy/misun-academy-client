'use client';

import { useState } from 'react';
import Container from '@/components/ui/container';
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { PaginationControls } from '@/components/module/testimonial/PaginationControls';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useGetMyLeaveRequestsQuery, useAddLeaveRequestMutation } from '@/redux/features/employee/employeeApi';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Page = () => {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const limit = 10;

    const { data, isLoading, error, refetch } = useGetMyLeaveRequestsQuery({ page, limit });
    const [addLeaveRequest, { isLoading: isSubmitting }] = useAddLeaveRequestMutation();

    // Form state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newType, setNewType] = useState('');
    const [newFrom, setNewFrom] = useState('');
    const [newTo, setNewTo] = useState('');
    const [newReason, setNewReason] = useState('');

    const handleAddRequest = async () => {
        if (!newType || !newFrom || !newTo || !newReason) {
            toast.error('Please fill in all fields.');
            return;
        }
        try {
            await addLeaveRequest({ type: newType, from: newFrom, to: newTo, reason: newReason }).unwrap();
            toast.success('Leave request submitted successfully.');
            setNewType(''); setNewFrom(''); setNewTo(''); setNewReason('');
            setDialogOpen(false);
            refetch();
        } catch {
            toast.error('Failed to submit leave request.');
        }
    };

    if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    if (error || !data) return <div className="flex items-center justify-center h-64"><p className="text-red-500">Error loading leave requests.</p></div>;

    const { requests, total, totalPages } = data.data;

    const filtered = requests.filter((r) => {
        const matchType = typeFilter === 'all' || r.type === typeFilter;
        const matchStatus = statusFilter === 'all' || r.status === statusFilter;
        return matchType && matchStatus;
    });

    return (
        <Container className="p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Leave Management</h1>
                    <p className="text-muted-foreground">View and manage your leave requests.</p>
                </div>
                <Button onClick={() => setDialogOpen(true)}>Request Leave</Button>
            </div>

            {/* Add Leave Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>New Leave Request</DialogTitle>
                        <DialogDescription>
                            Submitting as: <strong>{user?.name}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={newType} onValueChange={setNewType}>
                                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Paid Leave">Paid Leave</SelectItem>
                                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                                    <SelectItem value="Vacation">Vacation</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="sm:flex sm:gap-4">
                            <div className="space-y-2 flex-1">
                                <Label>From</Label>
                                <Input type="date" value={newFrom} onChange={(e) => setNewFrom(e.target.value)} />
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label>To</Label>
                                <Input type="date" value={newTo} onChange={(e) => setNewTo(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Reason</Label>
                            <Textarea value={newReason} onChange={(e) => setNewReason(e.target.value)} placeholder="Brief reason for leave" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddRequest} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Submit
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Filters */}
            <div className="flex gap-2 justify-end">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-36"><SelectValue placeholder="All types" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Paid Leave">Paid Leave</SelectItem>
                        <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                        <SelectItem value="Vacation">Vacation</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36"><SelectValue placeholder="All status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        No leave requests found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((r) => (
                                    <TableRow key={r._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>
                                                        {r.employeeName.split(' ').map((n) => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span>{r.employeeName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{r.type}</TableCell>
                                        <TableCell>{new Date(r.from).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(r.to).toLocaleDateString()}</TableCell>
                                        <TableCell className="max-w-xs truncate">{r.reason}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    r.status === 'Approved' ? 'default'
                                                        : r.status === 'Rejected' ? 'destructive'
                                                            : 'secondary'
                                                }
                                            >
                                                {r.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {total > 0 && (
                        <div className="flex flex-col items-center py-4 gap-2">
                            <div className="text-sm text-muted-foreground">
                                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                            </div>
                            {totalPages > 1 && (
                                <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default Page;
