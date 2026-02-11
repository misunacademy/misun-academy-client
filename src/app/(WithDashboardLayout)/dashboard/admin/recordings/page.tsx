"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Video, Edit, Trash2, Calendar, Clock, Loader2 } from "lucide-react"; 
import { toast } from "sonner";
import {
  useGetRecordingsQuery,
  useCreateRecordingMutation,
  useUpdateRecordingMutation,
  useDeleteRecordingMutation,
  Recording,
} from "@/redux/features/recording/recordingApi";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { useGetAllBatchesQuery } from "@/redux/api/batchApi";
import type { CourseResponse } from "@/redux/api/courseApi";
import type { BatchResponse } from "@/redux/api/batchApi";

// Use canonical API response shapes
type Course = CourseResponse;
type Batch = BatchResponse;
import { format } from "date-fns";

interface FormData {
  courseId: string;
  batchId: string;
  title: string;
  description: string;
  sessionDate: string;
  videoSource: "youtube" | "googledrive";
  videoId: string;
  duration: string;
  isPublished: boolean;
}



export default function RecordingsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [filters, setFilters] = useState<{
    courseId?: string;
    batchId?: string;
    isPublished?: boolean;
  }>({});

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordingToDelete, setRecordingToDelete] = useState<Recording | null>(null);

  const { data: recordingsData, isLoading } = useGetRecordingsQuery(filters);
  const { data: coursesData } = useGetAllCoursesQuery({});
  const { data: batchesData } = useGetAllBatchesQuery({});

  const [createRecording, { isLoading: isCreating }] = useCreateRecordingMutation();
  const [updateRecording, { isLoading: isUpdating }] = useUpdateRecordingMutation();
  const [deleteRecording, { isLoading: isDeleting }] = useDeleteRecordingMutation();

  const [formData, setFormData] = useState({
    courseId: "",
    batchId: "",
    title: "",
    description: "",
    sessionDate: "",
    videoSource: "youtube" as "youtube" | "googledrive",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Class Recordings</h1>
          <p className="text-muted-foreground">Manage recorded live class sessions</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Recording
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload Live Class Recording</DialogTitle>
              <DialogDescription>Add a new recorded session from a live class</DialogDescription>
            </DialogHeader>
            <RecordingForm
              formData={formData}
              setFormData={setFormData}
              courses={courses}
              batches={batches}
              onSubmit={handleCreate}
              isLoading={isCreating}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Select
            value={filters.courseId || "all"}
            onValueChange={(value) =>
              setFilters({ ...filters, courseId: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course: Course) => (
                <SelectItem key={course._id} value={course._id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.batchId || "all"}
            onValueChange={(value) =>
              setFilters({ ...filters, batchId: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Batches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {batches.map((batch: Batch) => (
                <SelectItem key={batch._id} value={batch._id}>
                  {batch.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              filters.isPublished === undefined
                ? "all"
                : filters.isPublished
                  ? "published"
                  : "unpublished"
            }
            onValueChange={(value) =>
              setFilters({
                ...filters,
                isPublished: value === "all" ? undefined : value === "published",
              })
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="unpublished">Unpublished</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Recordings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recordings ({recordings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : recordings.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Recordings Found</h3>
              <p className="text-muted-foreground">Upload your first live class recording to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Course/Batch</TableHead>
                  <TableHead>Session Date</TableHead>
                  <TableHead>Duration</TableHead>
                  {/* <TableHead>Views</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recordings.map((recording) => (
                  <TableRow key={recording._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{recording.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {recording.videoSource === "youtube" ? "YouTube" : "Google Drive"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">
                          {typeof recording.courseId === "object"
                            ? recording.courseId.title
                            : "N/A"}
                        </p>
                        <p className="text-muted-foreground">
                          {typeof recording.batchId === "object"
                            ? recording.batchId.title
                            : "N/A"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(recording.sessionDate), "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      {recording.duration && (
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {recording.duration} min
                        </div>
                      )}
                    </TableCell>
                    {/* <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        {recording.viewCount || 0}
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <Badge variant={recording.isPublished ? "default" : "secondary"}>
                        {recording.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(recording)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(recording)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button> 
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the recording &quot;{recordingToDelete?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Recording</DialogTitle>
            <DialogDescription>Update recording details</DialogDescription>
          </DialogHeader>
          <RecordingForm
            formData={formData}
            setFormData={setFormData}
            courses={courses}
            batches={batches}
            onSubmit={handleEdit}
            isLoading={isUpdating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Recording Form Component
function RecordingForm({
  formData,
  setFormData,
  courses,
  batches,
  onSubmit,
  isLoading,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  courses: Course[];
  batches: Batch[];
  onSubmit: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Course <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course: Course) => (
                <SelectItem key={course._id} value={course._id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            Batch <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.batchId} onValueChange={(value) => setFormData({ ...formData, batchId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch: Batch) => (
                <SelectItem key={batch._id} value={batch._id}>
                  {batch.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Week 1: Introduction to JavaScript"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the session content"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Session Date <span className="text-red-500">*</span>
          </Label>
          <Input
            type="date"
            value={formData.sessionDate}
            onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 90"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Video Source <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.videoSource}
          onValueChange={(value: "youtube" | "googledrive") =>
            setFormData({ ...formData, videoSource: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="googledrive">Google Drive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>
          Video ID <span className="text-red-500">*</span>
        </Label>
        <Input
          value={formData.videoId}
          onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
          placeholder={
            formData.videoSource === "youtube"
              ? "YouTube video ID (e.g., dQw4w9WgXcQ)"
              : "Google Drive file ID"
          }
        />
        <p className="text-xs text-muted-foreground">
          {formData.videoSource === "youtube"
            ? "YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID"
            : "Google Drive URL: https://drive.google.com/file/d/FILE_ID/view"}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished}
          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
          className="rounded border-gray-300"
        />
        <Label htmlFor="isPublished" className="cursor-pointer">
          Publish immediately (students can view)
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isLoading ? "Saving..." : "Save Recording"}
        </Button>
      </div>
    </div>
  );
}
