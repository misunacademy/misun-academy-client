/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Fragment, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Video, Edit, Trash2, Calendar, Clock, Loader2, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { YoutubePrivatePlayer } from "@/components/shared/youtube-private-player";
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

// ─── Types ────────────────────────────────────────────────────────────────────
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

const EMPTY_FORM: FormData = {
    courseId: "",
    batchId: "",
    title: "",
    description: "",
    sessionDate: "",
    videoSource: "youtube",
    videoId: "",
    duration: "",
    isPublished: false,
};

// ─── YouTube URL from videoId ─────────────────────────────────────────────────
function resolveUrl(recording: Recording): string | null {
    if (recording.videoUrl) return recording.videoUrl;
    if (recording.videoSource === "youtube" && recording.videoId)
        return `https://www.youtube.com/watch?v=${recording.videoId}`;
    return null;
}

// ─── Recording Form ───────────────────────────────────────────────────────────
function RecordingForm({
    formData, setFormData, courses, onSubmit, isLoading,
}: {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    courses: InstructorCourse[];
    onSubmit: () => void;
    isLoading: boolean;
}) {
    const selectedCourse = courses.find(c => c._id === formData.courseId);
    const batches = selectedCourse?.batches || [];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Course <span className="text-red-500">*</span></Label>
                    <Select
                        value={formData.courseId}
                        onValueChange={v => setFormData(p => ({ ...p, courseId: v, batchId: "" }))}
                    >
                        <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                        <SelectContent>
                            {courses.map(c => (
                                <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Batch <span className="text-red-500">*</span></Label>
                    <Select
                        value={formData.batchId}
                        onValueChange={v => setFormData(p => ({ ...p, batchId: v }))}
                        disabled={!formData.courseId}
                    >
                        <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                        <SelectContent>
                            {batches.map(b => (
                                <SelectItem key={b._id} value={b._id}>
                                    {b.title} - {b.status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Title <span className="text-red-500">*</span></Label>
                <Input
                    value={formData.title}
                    onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g., Week 1: Introduction to the course"
                />
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Brief description of the session content"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Session Date <span className="text-red-500">*</span></Label>
                    <Input
                        type="date"
                        value={formData.sessionDate}
                        onChange={e => setFormData(p => ({ ...p, sessionDate: e.target.value }))}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                        type="number"
                        value={formData.duration}
                        onChange={e => setFormData(p => ({ ...p, duration: e.target.value }))}
                        placeholder="e.g., 90"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Video Source <span className="text-red-500">*</span></Label>
                <Select
                    value={formData.videoSource}
                    onValueChange={(v: "youtube" | "googledrive") =>
                        setFormData(p => ({ ...p, videoSource: v }))
                    }
                >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="googledrive">Google Drive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Video ID <span className="text-red-500">*</span></Label>
                <Input
                    value={formData.videoId}
                    onChange={e => setFormData(p => ({ ...p, videoId: e.target.value }))}
                    placeholder={
                        formData.videoSource === "youtube"
                            ? "YouTube video ID (e.g., dQw4w9WgXcQ)"
                            : "Google Drive file ID"
                    }
                />
                <p className="text-xs text-muted-foreground">
                    {formData.videoSource === "youtube"
                        ? "Extract from: https://www.youtube.com/watch?v=VIDEO_ID"
                        : "Extract from: https://drive.google.com/file/d/FILE_ID/view"}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={e => setFormData(p => ({ ...p, isPublished: e.target.checked }))}
                    className="rounded border-gray-300"
                />
                <Label htmlFor="isPublished" className="cursor-pointer">
                    Publish immediately (students can view)
                </Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button onClick={onSubmit} disabled={isLoading}>
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {isLoading ? "Saving…" : "Save Recording"}
                </Button>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RecordingPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen]     = useState(false);
    const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
    const [playingRecording, setPlayingRecording] = useState<Recording | null>(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [filters, setFilters] = useState<{
        courseId?: string;
        batchId?: string;
        isPublished?: boolean;
    }>({});

    const [deleteDialogOpen, setDeleteDialogOpen]   = useState(false);
    const [recordingToDelete, setRecordingToDelete] = useState<Recording | null>(null);

    const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

    // Data
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

    // Batches for the filter bar (from selected course)
    const filterBatches = useMemo(() => {
        if (!filters.courseId) {
            return courses.flatMap(c => (c.batches || []).map(b => ({ ...b, courseTitle: c.title })));
        }
        const c = courses.find(x => x._id === filters.courseId);
        return (c?.batches || []).map(b => ({ ...b, courseTitle: c?.title || "" }));
    }, [courses, filters.courseId]);

    const resetForm = () => setFormData(EMPTY_FORM);

    // ── Create ───────────────────────────────────────────────────────────────
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

    // ── Edit ─────────────────────────────────────────────────────────────────
    const openEditDialog = (r: Recording) => {
        setSelectedRecording(r);
        setFormData({
            courseId:    typeof r.courseId === "string" ? r.courseId : r.courseId._id,
            batchId:     typeof r.batchId  === "string" ? r.batchId  : r.batchId._id,
            title:       r.title,
            description: r.description || "",
            sessionDate: r.sessionDate.split("T")[0],
            videoSource: r.videoSource,
            videoId:     r.videoId,
            duration:    r.duration?.toString() || "",
            isPublished: r.isPublished,
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

    // ── Delete ───────────────────────────────────────────────────────────────
    const handleDelete = (r: Recording) => { setRecordingToDelete(r); setDeleteDialogOpen(true); };

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Live Class Recordings</h1>
                    <p className="text-muted-foreground">Manage recorded live class sessions for your courses</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="h-4 w-4 mr-2" /> Upload Recording
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
                            onSubmit={handleCreate}
                            isLoading={isCreating}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    {/* Course */}
                    {/* <Select
                        value={filters.courseId || "all"}
                        onValueChange={v =>
                            setFilters(p => ({
                                ...p,
                                courseId: v === "all" ? undefined : v,
                                batchId: undefined,
                            }))
                        }
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="All Courses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Courses</SelectItem>
                            {courses.map(c => (
                                <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select> */}

                    {/* Batch */}
                    <Select
                        value={filters.batchId || "all"}
                        onValueChange={v =>
                            {
                                setFilters(p => ({ ...p, batchId: v === "all" ? undefined : v }));
                                setPage(1);
                            }
                        }
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="All Batches" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Batches</SelectItem>
                            {filterBatches.map((b: any) => (
                                <SelectItem key={b._id} value={b._id}>
                                    {b.title} - {b.status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Published */}
                    <Select
                        value={
                            filters.isPublished === undefined ? "all"
                                : filters.isPublished ? "published" : "unpublished"
                        }
                        onValueChange={v => {
                            setFilters(p => ({
                                ...p,
                                isPublished: v === "all" ? undefined : v === "published",
                            }));
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="unpublished">Draft</SelectItem>
                        </SelectContent>
                    </Select>
{/* 
                        <Select
                            value={String(limit)}
                            onValueChange={(value) => {
                                setLimit(Number(value));
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Rows per page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10 per page</SelectItem>
                                <SelectItem value="20">20 per page</SelectItem>
                                <SelectItem value="50">50 per page</SelectItem>
                            </SelectContent>
                        </Select> */}
                </CardContent>
            </Card>

            {/* Preview modal */}
            <Dialog
                open={!!playingRecording}
                onOpenChange={(open) => {
                    if (!open) setPlayingRecording(null);
                }}
            >
                <DialogContent className="max-w-4xl w-full bg-[#060f0a] border border-primary/25 text-white">
                    <DialogHeader>
                        <DialogTitle>{playingRecording?.title}</DialogTitle>
                    </DialogHeader>
                    {playingRecording ? (
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                            <YoutubePrivatePlayer url={resolveUrl(playingRecording) ?? ""} className="absolute inset-0 w-full h-full" />
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>

            {/* Recordings Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recordings ({meta.total})</CardTitle>
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
                                    <TableHead>Course / Batch</TableHead>
                                    <TableHead>Session Date</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Preview</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recordings.map(r => (
                                    <Fragment key={r._id}>
                                        <TableRow>
                                            {/* Title */}
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Video className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    <div>
                                                        <p className="font-medium">{r.title}</p>
                                                        <p className="text-xs text-muted-foreground capitalize">
                                                            {r.videoSource === "youtube" ? "YouTube" : "Google Drive"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Course / Batch */}
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p className="font-medium">
                                                        {typeof r.courseId === "object" ? r.courseId.title : "—"}
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        {typeof r.batchId === "object" ? r.batchId.title : "—"}
                                                    </p>
                                                </div>
                                            </TableCell>

                                            {/* Date */}
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {format(new Date(r.sessionDate), "MMM dd, yyyy")}
                                                </div>
                                            </TableCell>

                                            {/* Duration */}
                                            <TableCell>
                                                {r.duration && (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        {r.duration} min
                                                    </div>
                                                )}
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                                <Badge variant={r.isPublished ? "default" : "secondary"}>
                                                    {r.isPublished ? "Published" : "Draft"}
                                                </Badge>
                                            </TableCell>

                                            {/* Preview toggle */}
                                            <TableCell>
                                                {resolveUrl(r) ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setPlayingRecording(r)}
                                                    >
                                                        <PlayCircle className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">N/A</span>
                                                )}
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(r)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost" size="sm"
                                                        className="hover:text-destructive"
                                                        onClick={() => handleDelete(r)}
                                                        disabled={isDeleting}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                        {/* Inline player removed — modal preview used instead */}
                                    </Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    <div className="mt-6 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {meta.total === 0 ? 0 : ((page - 1) * limit) + 1} to {Math.min(page * limit, meta.total)} of {meta.total} recordings
                        </p>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                                disabled={meta.page <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className=" px-3 py-1.5 text-sm text-muted-foreground">
                                Page {meta.page} of {meta.totalPages || 1}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((current) => Math.min(current + 1, meta.totalPages || 1))}
                                disabled={meta.page >= (meta.totalPages || 1)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delete confirmation */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete &quot;{recordingToDelete?.title}&quot;. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit dialog */}
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
                        onSubmit={handleEdit}
                        isLoading={isUpdating}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}