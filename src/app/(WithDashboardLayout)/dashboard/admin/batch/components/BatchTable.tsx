import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BatchResponse } from "@/redux/api/batchApi";
import { Edit, Trash2 } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";

interface BatchListMeta {
  total?: number;
  totalPages?: number;
}

interface BatchListResponse {
  data?: BatchResponse[];
  meta?: BatchListMeta;
}

interface BatchTableProps {
  filters?: ReactNode;
  actions?: ReactNode;
  batches?: BatchListResponse;
  isLoading: boolean;
  error: unknown;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onStatusChange: (batchId: string, status: string) => void;
  onEdit: (batchId: string) => void;
  onDelete: (batch: BatchResponse) => void;
  getStatusBadge: (status: string) => ReactNode;
  statusOptions: Array<{ value: string; label: string }>;
}

const BatchTable = ({
  filters,
  actions,
  batches,
  isLoading,
  error,
  page,
  limit,
  onPageChange,
  onStatusChange,
  onEdit,
  onDelete,
  getStatusBadge,
  statusOptions,
}: BatchTableProps) => {
  const rows = batches?.data ?? [];
  const total = batches?.meta?.total ?? 0;
  const totalPages = batches?.meta?.totalPages ?? 1;
  const emptyState = error ? "Error loading batches" : (
    <div className="flex flex-col items-center gap-1">
      <span>No batches found</span>
      <span className="text-xs text-muted-foreground">Create your first batch to get started</span>
    </div>
  );
  const pagination = rows.length > 0 ? { page, totalPages, total, limit, onPageChange } : undefined;

  const columns = useMemo<ColumnDef<BatchResponse>[]>(() => [
    { accessorKey: "title", header: "Title", cell: ({ row }) => <span className="font-medium">{row.original.title}</span> },
    { id: "course", header: "Course", cell: ({ row }) => (typeof row.original.courseId === "object" && row.original.courseId !== null ? row.original.courseId.title : "N/A") },
    { accessorKey: "price", header: "Price", cell: ({ row }) => `৳${row.original.price}` },
    { accessorKey: "status", header: "Status", cell: ({ row }) => getStatusBadge(row.original.status) },
    { accessorKey: "startDate", header: "Start Date", cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString() },
    { accessorKey: "endDate", header: "End Date", cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString() },
    { accessorKey: "enrollmentStartDate", header: "Enrollment Start", cell: ({ row }) => new Date(row.original.enrollmentStartDate).toLocaleDateString() },
    { accessorKey: "enrollmentEndDate", header: "Enrollment End", cell: ({ row }) => new Date(row.original.enrollmentEndDate).toLocaleDateString() },
    { accessorKey: "currentEnrollment", header: "Enrolled", cell: ({ row }) => <span className="text-center block">{row.original.currentEnrollment || 0}</span> },
    { id: "actions", header: "Actions", cell: ({ row }) => {
      const b = row.original
      return (
        <div className="flex items-center gap-2">
          <Select value={b.status} onValueChange={(val) => onStatusChange(b._id, val)}>
            <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => onEdit(b._id)} className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => onDelete(b)} className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
        </div>
      )
    }},
  ], [getStatusBadge, onStatusChange, onEdit, onDelete, statusOptions])

  return (
    <DataTable
      heading="All Batches"
      subheading="Manage and view all batches"
      filters={filters}
      actions={actions}
      columns={columns}
      data={rows}
      getRowId={(batch) => batch._id}
      isLoading={isLoading}
      emptyState={emptyState}
      pagination={pagination}
    />
  );
};

export default BatchTable;
