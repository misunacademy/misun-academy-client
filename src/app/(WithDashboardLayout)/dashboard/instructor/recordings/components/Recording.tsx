/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Video } from "lucide-react";
import { toast } from "sonner";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import DashboardPageTableWithPagination from "@/components/layout/DashboardPageTableWithPagination";
import RecordingFiltersCard, { RecordingFilters } from "./RecordingFiltersCard";
import RecordingFormDialog from "./RecordingFormDialog";
import RecordingPreviewDialog from "./RecordingPreviewDialog";
import RecordingDeleteDialog from "./RecordingDeleteDialog";
import RecordingTableRow from "./RecordingTableRow";
import { EMPTY_RECORDING_FORM, type RecordingFormData } from "./RecordingForm";
import {
  useGetRecordingsQuery,
  useCreateRecordingMutation,
  useUpdateRecordingMutation,
  useDeleteRecordingMutation,
  type Recording,
} from "@/redux/api/recordingApi";
import {
  useGetInstructorCoursesQuery,
  type InstructorCourse,
} from "@/redux/api/instructorApi";

const resolveUrl = (recording: Recording): string | null => {
  if (recording.videoUrl) return recording.videoUrl;
  if (recording.videoSource === "youtube" && recording.videoId) {
    return `https://www.youtube.com/watch?v=${recording.videoId}`;
  }
  return null;
};

export default function RecordingPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [playingRecording, setPlayingRecording] = useState<Recording | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState<RecordingFilters>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordingToDelete, setRecordingToDelete] = useState<Recording | null>(null);
  const [formData, setFormData] = useState<RecordingFormData>(EMPTY_RECORDING_FORM);

  const { data: recordingsData, isLoading } = useGetRecordingsQuery({
    ...filters,
    page,
    limit,
  });
  const { data: coursesData } = useGetInstructorCoursesQuery();

  const [createRecording, { isLoading: isCreating }] = useCreateRecordingMutation();
  const [updateRecording, { isLoading: isUpdating }] = useUpdateRecordingMutation();
  const [deleteRecording, { isLoading: isDeleting }] = useDeleteRecordingMutation();

  const courses: InstructorCourse[] = useMemo(() => coursesData?.data || [], [coursesData?.data]);
  const recordings: Recording[] = recordingsData?.data || [];
  const meta = recordingsData?.meta ?? { page, limit, total: 0, totalPages: 1 };

  const filterBatches = useMemo(
    () =>
      courses.flatMap((course) =>
        (course.batches || []).map((batch) => ({
          ...batch,
          courseTitle: course.title,
        }))
      ),
    [courses]
  );

  const pagination = meta.total > 0
    ? { page, totalPages: meta.totalPages || 1, total: meta.total, limit, onPageChange: setPage }
    : undefined;

  const emptyState = (
    <div className="flex flex-col items-center gap-2">
      <Video className="h-10 w-10 text-muted-foreground" />
      <div className="text-sm font-medium">No Recordings Found</div>
      <div className="text-xs text-muted-foreground">Upload your first live class recording to get started.</div>
    </div>
  );

  const resetForm = () => setFormData(EMPTY_RECORDING_FORM);

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
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create recording");
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
    } catch (err: any) {
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
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete recording");
    }
  };

  return (
    <DashboardPageContainer
      heading="Live Class Recordings"
      subheading="Manage recorded live class sessions for your courses"
      buttons={
        <RecordingFormDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          title="Upload Live Class Recording"
          description="Add a new recorded session from a live class"
          trigger={
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" /> Upload Recording
            </Button>
          }
          formData={formData}
          setFormData={setFormData}
          courses={courses}
          onSubmit={handleCreate}
          isLoading={isCreating}
        />
      }
      content={
        <div className="space-y-6">
          <DashboardPageTableWithPagination
            heading={`Recordings (${meta.total})`}
            filters={
              <RecordingFiltersCard
                filters={filters}
                batches={filterBatches}
                onFiltersChange={setFilters}
                onPageReset={() => setPage(1)}
              />
            }
            columns={[
              "Title",
              "Course / Batch",
              "Session Date",
              "Duration",
              "Status",
              "Preview",
              "Actions",
            ]}
            data={recordings}
            renderRow={(recording) => (
              <RecordingTableRow
                recording={recording}
                onPreview={setPlayingRecording}
                onEdit={openEditDialog}
                onDelete={handleDelete}
                getPreviewUrl={resolveUrl}
                isDeleting={isDeleting}
              />
            )}
            getRowKey={(recording) => recording._id}
            isLoading={isLoading}
            emptyState={emptyState}
            pagination={pagination}
          />

          <RecordingPreviewDialog
            recording={playingRecording}
            onOpenChange={(open) => {
              if (!open) setPlayingRecording(null);
            }}
          />

          <RecordingDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            recording={recordingToDelete}
            isDeleting={isDeleting}
            onConfirm={confirmDelete}
          />

          <RecordingFormDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            title="Edit Recording"
            description="Update recording details"
            formData={formData}
            setFormData={setFormData}
            courses={courses}
            onSubmit={handleEdit}
            isLoading={isUpdating}
          />
        </div>
      }
    />
  );
}
