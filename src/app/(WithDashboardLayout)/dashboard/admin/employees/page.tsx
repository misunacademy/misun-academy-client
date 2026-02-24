'use client';

import { useState } from 'react';
import Container from '@/components/ui/container';
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Search } from 'lucide-react';
import { PaginationControls } from '@/components/module/testimonial/PaginationControls';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useGetAllEmployeesQuery } from '@/redux/api/employeeAdminApi';

const Page = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const limit = 10;

    const { data, isLoading, error } = useGetAllEmployeesQuery({ page, limit, search: search || undefined });

    if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    if (error || !data) return <div className="flex items-center justify-center h-64"><p className="text-red-500">Error loading employees.</p></div>;

    const { employees, total, totalPages } = data.data;

    const filtered = statusFilter === 'all'
        ? employees
        : employees.filter((e) => e.status.toLowerCase() === statusFilter);

    return (
        <Container className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Employee Management</h1>
                <p className="text-muted-foreground">View and manage all company employees.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 max-w-sm space-y-1">
                    <Label>Search</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search by name or email..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && setSearch(searchInput)}
                        />
                        <Button variant="outline" onClick={() => setSearch(searchInput)}>
                            <Search className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="space-y-1">
                    <Label>Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((emp) => (
                                    <TableRow key={emp._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    {emp.image && <AvatarImage src={emp.image} />}
                                                    <AvatarFallback>
                                                        {emp.name.split(' ').map((n) => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{emp.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{emp.email}</TableCell>
                                        <TableCell>{emp.phone || '—'}</TableCell>
                                        <TableCell>
                                            <Badge variant={emp.status.toLowerCase() === 'active' ? 'default' : 'secondary'}>
                                                {emp.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(emp.createdAt).toLocaleDateString()}</TableCell>
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
