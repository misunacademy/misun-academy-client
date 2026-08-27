"use client";

import { useCallback, useMemo, useState } from "react";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useDeleteBatchMutation,
  useGetAllBatchesQuery,
  useUpdateBatchMutation,
} from "@/redux/api/batchApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import BatchFilters from "./BatchFilters";
import BatchTable from "./BatchTable";

const BATCH_STATUSES = [
  { value: "draft", label: "Draft", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  { value: "upcoming", label: "Upcoming", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  { value: "running", label: "Running", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  { value: "completed", label: "Completed", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
];

export default function BatchDashboard() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<{ _id: string; title: string } | null>(null);
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const router = useRouter();

  const { data: batches, isLoading, error, refetch } = useGetAllBatchesQuery({
    courseId: courseFilter === "all" ? undefined : courseFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
    page, limit,
  });

  const { data: coursesData } = useGetAllCoursesQuery({ status: "published" });
  const [updateBatch] = useUpdateBatchMutation();
  const [deleteBatch] = useDeleteBatchMutation();

  const courses = useMemo(() => coursesData?.data || [], [coursesData]);

  const handleFilterChange = useCallback(() => { setPage(1); }, []);

  const handleStatusChange = useCallback(async (batchId: string, newStatus: string) => {
    if (!batchId || batchId === "undefined" || !newStatus) return;
    try {
      await updateBatch({ id: batchId, data: { status: newStatus as "draft" | "upcoming" | "running" | "completed" } }).unwrap();
      toast.success(`Status updated to ${newStatus}`);
      await refetch();
    } catch (error) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to update status");
    }
  }, [updateBatch, refetch]);

  const handleDeleteClick = useCallback((batch: { _id: string; title: string }) => {
    setBatchToDelete(batch);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!batchToDelete) return;
    try {
      await deleteBatch(batchToDelete._id).unwrap();
      toast.success("Batch deleted successfully");
      setDeleteDialogOpen(false);
      setBatchToDelete(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete batch");
    }
  }, [batchToDelete, deleteBatch]);

  const getStatusBadge = useCallback((status: string) => {
    const statusConfig = BATCH_STATUSES.find((s) => s.value === status);
    return <Badge className={statusConfig?.className || "bg-gray-100 text-gray-800"}>{statusConfig?.label || status}</Badge>;
  }, []);

  return (
    <div className="space-y-6">
      <BatchTable
        batches={batches}
        filters={
          <BatchFilters
            courses={courses} courseFilter={courseFilter} statusFilter={statusFilter}
            statusOptions={BATCH_STATUSES}
            onCourseChange={(val) => { setCourseFilter(val); handleFilterChange(); }}
            onStatusChange={(val) => { setStatusFilter(val); handleFilterChange(); }}
          />
        }
        isLoading={isLoading} error={error} page={page} limit={limit}
        onPageChange={setPage} onStatusChange={handleStatusChange}
        onEdit={(batchId) => router.push(`/dashboard/admin/batch/${batchId}/edit`)}
        onDelete={handleDeleteClick} getStatusBadge={getStatusBadge} statusOptions={BATCH_STATUSES}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the batch &ldquo;{batchToDelete?.title}&ldquo;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
