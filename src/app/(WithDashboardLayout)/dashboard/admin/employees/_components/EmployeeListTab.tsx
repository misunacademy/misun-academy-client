'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useGetAllEmployeesQuery } from '@/redux/api/employeeAdminApi';
import DashboardPageTableWithPagination from '@/components/layout/DashboardPageTableWithPagination';
import { EmployeeDetailSheet, type EmployeeListItem } from './EmployeeDetailSheet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmployeeListTab() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeListItem | null>(null);
    const limit = 10;

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const { data, isLoading, isFetching } = useGetAllEmployeesQuery({
        page, limit, search: search || undefined,
    });

    const employees = data?.data?.employees ?? [];
    const total = data?.data?.total ?? 0;
    const totalPages = data?.data?.totalPages ?? 1;

    const filtered = statusFilter === 'all'
        ? employees
        : employees.filter((e) => e.status.toLowerCase() === statusFilter);

    return (
        <>
            <DashboardPageTableWithPagination
                heading="Employee List"
                subheading="Here you can view and manage employee information"
                filters={
                    <>
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Filters</CardTitle>
                            </CardHeader>
                            <CardContent className="flex gap-4 justify-between">

                                <div className="flex gap-2 flex-1 min-w-48 max-w-sm">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9"
                                            placeholder="Search name or email…"
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>

                            </CardContent>
                        </Card>

                    </>
                }
                columns={['Employee', 'Email', 'Phone', 'Designation', 'Address', 'Status', 'Joined', 'Action']}
                data={filtered}
                getRowKey={(emp) => emp._id}
                isLoading={isLoading}
                isFetching={isFetching}
                emptyState="No employees found."
                renderRow={(emp) => (
                    <>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    {emp.image && <AvatarImage src={emp.image} />}
                                    <AvatarFallback className="text-xs">
                                        {emp.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-sm">{emp.name}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{emp.role}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-sm">{emp.email}</TableCell>
                        <TableCell className="text-sm">{emp.phone || '—'}</TableCell>
                        <TableCell className="text-sm max-w-[160px] truncate">{emp.designation || '—'}</TableCell>
                        <TableCell className="text-sm max-w-[140px] truncate">{emp.address || '—'}</TableCell>
                        <TableCell>
                            <Badge variant={emp.status.toLowerCase() === 'active' ? 'default' : 'secondary'}>
                                {emp.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                            {new Date(emp.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                            <Button
                                variant="link"
                                className="text-blue-500 hover:text-blue-600 cursor-pointer p-0 h-auto"
                                size="sm"
                                onClick={() => setSelectedEmployee(emp as EmployeeListItem)}
                            >
                                View Details
                            </Button>
                        </TableCell>
                    </>
                )}
                pagination={{ page, totalPages, total, limit, onPageChange: setPage }}
            />

            {/* Employee detail side-sheet */}
            <EmployeeDetailSheet
                employee={selectedEmployee}
                open={!!selectedEmployee}
                onClose={() => setSelectedEmployee(null)}
            />
        </>
    );
}
