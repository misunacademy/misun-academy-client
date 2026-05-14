"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Video } from "lucide-react";
import { toast } from "sonner";
import {
  useGetRecordingsQuery,
  useCreateRecordingMutation,
  useUpdateRecordingMutation,
  useDeleteRecordingMutation,
  Recording,
} from "@/redux/api/recordingApi";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { useGetAllBatchesQuery } from "@/redux/api/batchApi";
import type { CourseResponse } from "@/redux/api/courseApi";
import type { BatchResponse } from "@/redux/api/batchApi";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import DashboardPageTableWithPagination from "@/components/layout/DashboardPageTableWithPagination";
import RecordingFiltersCard, { RecordingFilters } from "./components/RecordingFiltersCard";
import RecordingFormDialog from "./components/RecordingFormDialog";
import RecordingTableRow from "./components/RecordingTableRow";
import RecordingPreviewDialog from "./components/RecordingPreviewDialog";
import RecordingDeleteDialog from "./components/RecordingDeleteDialog";
import type { RecordingFormData } from "./components/RecordingForm";

// Use canonical API response shapes
type Course = CourseResponse;
type Batch = BatchResponse;

export default function RecordingsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [playingRecording, setPlayingRecording] = useState<Recording | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState<RecordingFilters>({});

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordingToDelete, setRecordingToDelete] = useState<Recording | null>(null);

  const { data: recordingsData, isLoading, isFetching } = useGetRecordingsQuery({
    ...filters,
    page,
    limit,
  });
  const { data: coursesData } = useGetAllCoursesQuery({});
  const { data: batchesData } = useGetAllBatchesQuery({});

  const [createRecording, { isLoading: isCreating }] = useCreateRecordingMutation();
  const [updateRecording, { isLoading: isUpdating }] = useUpdateRecordingMutation();
  const [deleteRecording, { isLoading: isDeleting }] = useDeleteRecordingMutation();

  const [formData, setFormData] = useState<RecordingFormData>({
    courseId: "",
    batchId: "",
    title: "",
    description: "",
    sessionDate: "",
    videoSource: "youtube",
    videoId: "",
    duration: "",
    isPublished: false,
  });

  const resetForm = () => {
    setFormData({
      courseId: "",
      batchId: "",
      title: "",
      description: "",
      sessionDate: "",
      videoSource: "youtube",
      videoId: "",
      duration: "",
      isPublished: false,
    });
  };

  const handleCreate = async () => {
    if (!formData.courseId || !formData.batchId || !formData.title || !formData.sessionDate || !formData.videoId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createRecording({
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
      }).unwrap();
      toast.success("Recording created successfully");
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create recording");
    }
  };

  const handleEdit = async () => {
    if (!selectedRecording) return;

    try {
      await updateRecording({
        id: selectedRecording._id,
        data: {
          ...formData,
          duration: formData.duration ? parseInt(formData.duration) : undefined,
        },
      }).unwrap();
      toast.success("Recording updated successfully");
      setIsEditOpen(false);
      setSelectedRecording(null);
      resetForm();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update recording");
    }
  };

  const handleDelete = (recording: Recording) => {
    setRecordingToDelete(recording);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!recordingToDelete) return;
    try {
      await deleteRecording(recordingToDelete._id).unwrap();
      toast.success("Recording deleted successfully");
      setDeleteDialogOpen(false);
      setRecordingToDelete(null);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete recording");
    }
  };

  const openEditDialog = (recording: Recording) => {
    setSelectedRecording(recording);
    setFormData({
      courseId: typeof recording.courseId === "string" ? recording.courseId : recording.courseId._id,
      batchId: typeof recording.batchId === "string" ? recording.batchId : recording.batchId._id,
      title: recording.title,
      description: recording.description || "",
      sessionDate: recording.sessionDate.split("T")[0],
      videoSource: recording.videoSource,
      videoId: recording.videoId,
      duration: recording.duration?.toString() || "",
      isPublished: recording.isPublished,
    });
    setIsEditOpen(true);
  };

  const courses = coursesData?.data || [];
  const batches = batchesData?.data || [];
  const recordings = recordingsData?.data || [];
  const meta = recordingsData?.meta ?? { page, limit, total: 0, totalPages: 1 };

  const getRecordingUrl = (rec?: Recording | null) => {
    if (!rec) return "";
    if (rec.videoSource === "youtube") return `https://www.youtube.com/watch?v=${rec.videoId}`;
    if (rec.videoSource === "googledrive") return `https://drive.google.com/file/d/${rec.videoId}/preview`;
    return rec.videoUrl ?? "";
  };

  const getBatchCourseId = (batch: Batch) =>
    typeof batch.courseId === "string" ? batch.courseId : batch.courseId._id;

  const getBatchCourseTitle = (batch: Batch) => {
    if (typeof batch.courseId === "string") {
      return courses.find((course: Course) => course._id === batch.courseId)?.title;
    }
    return batch.courseId.title;
  };

  const filteredFilterBatches = filters.courseId
    ? batches.filter((batch) => getBatchCourseId(batch) === filters.courseId)
    : batches;

  const filteredFormBatches = formData.courseId
    ? batches.filter((batch) => getBatchCourseId(batch) === formData.courseId)
    : batches;

  const emptyState = (
    <div className="flex flex-col items-center gap-3">
      <Video className="h-12 w-12 text-muted-foreground" />
      <div className="text-center">
        <h3 className="text-lg font-semibold">No Recordings Found</h3>
        <p className="text-muted-foreground">Upload your first live class recording to get started.</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <DashboardPageContainer
      heading="Live Class Recordings"
      subheading="Manage recorded live class sessions"
      buttons={
        <RecordingFormDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onOpen={resetForm}
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Recording
            </Button>
          }
          title="Upload Live Class Recording"
          description="Add a new recorded session from a live class"
          formData={formData}
          setFormData={setFormData}
          courses={courses}
          batches={filteredFormBatches}
          onSubmit={handleCreate}
          isLoading={isCreating}
        />
      }
      content={
        <div className="space-y-6">
          <RecordingFiltersCard
            filters={filters}
            courses={courses}
            batches={filteredFilterBatches}
            onFiltersChange={setFilters}
            onPageReset={() => setPage(1)}
            getBatchCourseTitle={getBatchCourseTitle}
          />

          <DashboardPageTableWithPagination
            heading={`Recordings (${meta.total})`}
            columns={["Title", "Course/Batch", "Session Date", "Duration", "Status", "Actions"]}
            data={recordings}
            renderRow={(recording) => (
              <RecordingTableRow
                recording={recording}
                onPlay={(item) => setPlayingRecording(item)}
                onEdit={openEditDialog}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            )}
            getRowKey={(recording) => recording._id}
            isLoading={isLoading}
            isFetching={isFetching}
            emptyState={emptyState}
            pagination={{
              page: meta.page,
              totalPages: meta.totalPages || 1,
              total: meta.total,
              limit,
              onPageChange: setPage,
            }}
          />

          <RecordingPreviewDialog
            open={!!playingRecording}
            recording={playingRecording}
            onOpenChange={(open) => {
              if (!open) setPlayingRecording(null);
            }}
            getRecordingUrl={getRecordingUrl}
          />

          <RecordingDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            recording={recordingToDelete}
            onConfirm={confirmDelete}
            isDeleting={isDeleting}
          />

          <RecordingFormDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            title="Edit Recording"
            description="Update recording details"
            formData={formData}
            setFormData={setFormData}
            courses={courses}
            batches={filteredFormBatches}
            onSubmit={handleEdit}
            isLoading={isUpdating}
          />
        </div>
      }
    />
  );
}
