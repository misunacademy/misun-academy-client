'use client';

import { useState } from 'react';
import Container from '@/components/ui/container';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Loader2 } from 'lucide-react';
import { PaginationControls } from '@/components/module/testimonial/PaginationControls';
import { useGetMySalariesQuery } from '@/redux/features/employee/employeeApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Salary } from '@/redux/features/employee/employeeApi';

const Page = () => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Salary | null>(null);
  const limit = 10;

  const { data, isLoading, error } = useGetMySalariesQuery({ page, limit });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading salary data.</p>
      </div>
    );
  }

  const { salaries, total, totalPages } = data.data;

  return (
    <Container className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Salaries</h1>
        <p className="text-muted-foreground">View your salary payment history.</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Month / Year</TableHead>
            <TableHead>Salary (BDT)</TableHead>
            <TableHead>Bonus (BDT)</TableHead>
            <TableHead>Total (BDT)</TableHead>
            <TableHead>Payment Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salaries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                No salary records yet.
              </TableCell>
            </TableRow>
          ) : (
            salaries.map((row) => (
              <TableRow key={row._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {row.employeeName.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{row.employeeName}</span>
                  </div>
                </TableCell>
                <TableCell>{row.jobTitle}</TableCell>
                <TableCell>{row.month} {row.year}</TableCell>
                <TableCell>{row.amount.toLocaleString()}</TableCell>
                <TableCell>{row.bonus.toLocaleString()}</TableCell>
                <TableCell>{row.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  {row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={row.status === 'Paid' ? 'default' : 'secondary'}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => setSelected(row)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {total > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </div>
          {totalPages > 1 && (
            <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Salary Detail</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <p><strong>Employee:</strong> {selected.employeeName}</p>
              <p><strong>Job Title:</strong> {selected.jobTitle}</p>
              <p><strong>Period:</strong> {selected.month} {selected.year}</p>
              <p><strong>Base Salary:</strong> BDT {selected.amount.toLocaleString()}</p>
              <p><strong>Bonus:</strong> BDT {selected.bonus.toLocaleString()}</p>
              <p><strong>Total:</strong> BDT {selected.totalAmount.toLocaleString()}</p>
              <p><strong>Status:</strong> {selected.status}</p>
              {selected.paymentDate && (
                <p><strong>Payment Date:</strong> {new Date(selected.paymentDate).toLocaleDateString()}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
};

export default Page;
