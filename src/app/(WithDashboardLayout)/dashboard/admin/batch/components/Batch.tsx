/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCreateBatchMutation,
  useDeleteBatchMutation,
  useGetAllBatchesQuery,
  useUpdateBatchMutation,
} from "@/redux/api/batchApi";
import BatchFilters from "./BatchFilters";
import BatchTable from "./BatchTable";

const BATCH_STATUSES = [
  { value: "draft", label: "Draft", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  { value: "upcoming", label: "Upcoming", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  { value: "running", label: "Running", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  { value: "completed", label: "Completed", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
];

const INITIAL_FORM_STATE = {
  title: "",
  price: "",
  status: "draft",
  selectedCourse: "",
  startDate: "",
  endDate: "",
  enrollmentStartDate: "",
  enrollmentEndDate: "",
  description: "",
};

export default function BatchDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<any>(null);
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const router = useRouter();

  const { data: batches, isLoading, error, refetch } = useGetAllBatchesQuery({
    courseId: courseFilter === "all" ? undefined : courseFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
    page,
    limit,
  });

  const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery({ status: "published" });
  const [createBatch, { isLoading: isCreating }] = useCreateBatchMutation();
  const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchMutation();
  const [deleteBatch] = useDeleteBatchMutation();

  const courses = coursesData?.data || [];

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setEditingBatchId(null);
    setShowForm(false);
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  const handleStatusChange = async (batchId: string, newStatus: string) => {
    if (!batchId || batchId === "undefined" || !newStatus) return;

    try {
      await updateBatch({ id: batchId, data: { status: newStatus as "draft" | "upcoming" | "running" | "completed" } }).unwrap();
      toast.success(`Status updated to ${newStatus}`);
      await refetch();
    } catch (error) {
      toast.error((error as any)?.data?.message || "Failed to update status");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    const batchData = {
      title: formData.title,
      price: Number(formData.price),
      status: formData.status as "draft" | "upcoming" | "running" | "completed",
      courseId: formData.selectedCourse,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      enrollmentStartDate: formData.enrollmentStartDate ? new Date(formData.enrollmentStartDate) : undefined,
      enrollmentEndDate: formData.enrollmentEndDate ? new Date(formData.enrollmentEndDate) : undefined,
      description: formData.description || undefined,
    };

    try {
      if (editingBatchId) {
        await updateBatch({ id: editingBatchId, data: batchData }).unwrap();
        toast.success("Batch updated successfully");
      } else {
        await createBatch(batchData).unwrap();
        toast.success("Batch created successfully");
      }
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || (editingBatchId ? "Failed to update batch" : "Failed to create batch"));
    }
  };

  const handleDeleteClick = (batch: any) => {
    setBatchToDelete(batch);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!batchToDelete) return;

    try {
      await deleteBatch(batchToDelete?._id).unwrap();
      toast.success("Batch deleted successfully");
      setDeleteDialogOpen(false);
      setBatchToDelete(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete batch");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = BATCH_STATUSES.find((s) => s.value === status);
    return (
      <Badge className={statusConfig?.className || "bg-gray-100 text-gray-800"}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{editingBatchId ? "Edit Batch" : "Create New Batch"}</CardTitle>
                <CardDescription>
                  {editingBatchId ? "Update batch information" : "Add a new batch with all required details"}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select
                  value={formData.selectedCourse}
                  onValueChange={(val) => handleInputChange("selectedCourse", val)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursesLoading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    ) : courses.length > 0 ? (
                      courses.map((course: any) => (
                        <SelectItem key={course._id} value={course._id}>
                          {course.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-courses" disabled>
                        No courses available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Batch Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g. Batch 6 - Winter 2026"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (BDT) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="4000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => handleInputChange("status", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BATCH_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of this batch"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Batch Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Batch End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enrollmentStartDate">Enrollment Start *</Label>
                  <Input
                    id="enrollmentStartDate"
                    type="date"
                    value={formData.enrollmentStartDate}
                    onChange={(e) => handleInputChange("enrollmentStartDate", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollmentEndDate">Enrollment End *</Label>
                  <Input
                    id="enrollmentEndDate"
                    type="date"
                    value={formData.enrollmentEndDate}
                    onChange={(e) => handleInputChange("enrollmentEndDate", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingBatchId ? "Update Batch" : "Create Batch"}
                </Button>
                {editingBatchId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <BatchTable
        batches={batches}
        filters={
          <BatchFilters
            courses={courses}
            courseFilter={courseFilter}
            statusFilter={statusFilter}
            statusOptions={BATCH_STATUSES}
            onCourseChange={(val) => {
              setCourseFilter(val);
              handleFilterChange();
            }}
            onStatusChange={(val) => {
              setStatusFilter(val);
              handleFilterChange();
            }}
          />
        }
        isLoading={isLoading}
        error={error}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onStatusChange={handleStatusChange}
        onEdit={(batchId) => router.push(`/dashboard/admin/batch/${batchId}/edit`)}
        onDelete={handleDeleteClick}
        getStatusBadge={getStatusBadge}
        statusOptions={BATCH_STATUSES}
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
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
