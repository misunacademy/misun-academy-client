import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";
import type { BatchResponse } from "@/redux/api/batchApi";
import { Edit, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import DashboardPageTableWithPagination from "@/components/layout/DashboardPageTableWithPagination";

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

  return (
    <DashboardPageTableWithPagination
      heading="All Batches"
      subheading="Manage and view all batches"
      filters={filters}
      columns={[
        "Title",
        "Course",
        "Price",
        "Status",
        "Start Date",
        "End Date",
        "Enrollment Start",
        "Enrollment End",
        "Enrolled",
        "Actions",
      ]}
      data={rows}
      renderRow={(batch) => (
        <>
          <TableCell className="font-medium">{batch.title}</TableCell>
          <TableCell>
            {typeof batch.courseId === "string" ? "N/A" : batch.courseId?.title || "N/A"}
          </TableCell>
          <TableCell>৳{batch.price}</TableCell>
          <TableCell>{getStatusBadge(batch.status)}</TableCell>
          <TableCell>{new Date(batch.startDate).toLocaleDateString()}</TableCell>
          <TableCell>{new Date(batch.endDate).toLocaleDateString()}</TableCell>
          <TableCell>{new Date(batch.enrollmentStartDate).toLocaleDateString()}</TableCell>
          <TableCell>{new Date(batch.enrollmentEndDate).toLocaleDateString()}</TableCell>
          <TableCell className="text-center">{batch.currentEnrollment || 0}</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Select value={batch.status} onValueChange={(val) => onStatusChange(batch._id, val)}>
                <SelectTrigger className="w-28 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(batch._id)}
                className="h-8 w-8"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(batch)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </TableCell>
        </>
      )}
      getRowKey={(batch) => batch._id}
      isLoading={isLoading}
      emptyState={emptyState}
      pagination={pagination}
    />
  );
};

export default BatchTable;
