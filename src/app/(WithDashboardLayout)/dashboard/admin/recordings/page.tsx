/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Play } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useGetRecordingsQuery, useCreateRecordingMutation, useUpdateRecordingMutation, useDeleteRecordingMutation } from "@/redux/features/recording/recordingApi";
import { Course } from "@/types/common";
import { useGetCoursesQuery } from "@/redux/features/course/courseApi";

const recordingSchema = z.object({
    course: z.string().min(1, "Please select a course"),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    videoUrl: z.string().url("Please enter a valid URL"),
    videoType: z.enum(["youtube", "gdrive"]),
});

type RecordingForm = z.infer<typeof recordingSchema>;

interface Recording {
    _id: string;
    course: string | {
        _id: string;
        title: string;
    };
    title: string;
    description?: string;
    videoUrl: string;
    videoType: "youtube" | "gdrive";
    createdAt: string;
}

export default function RecordingsPage() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingRecording, setEditingRecording] = useState<any | null>(null);

    const { data: recordingsData, isLoading: recordingsLoading } = useGetRecordingsQuery({});
    const { data: coursesData } = useGetCoursesQuery({});
    const courses = coursesData?.data || [];
    const recordings = recordingsData?.data || [];

    const [createRecording] = useCreateRecordingMutation();
    const [updateRecording] = useUpdateRecordingMutation();
    const [deleteRecording] = useDeleteRecordingMutation();

    const form = useForm<RecordingForm>({
        resolver: zodResolver(recordingSchema),
        defaultValues: {
            course: "",
            title: "",
            description: "",
            videoUrl: "",
            videoType: "youtube",
        },
    });

    const onSubmit = async (data: RecordingForm) => {
        try {
            if (editingRecording) {
                await updateRecording({ id: editingRecording._id, data }).unwrap();
                toast("Recording updated successfully");
            } else {
                await createRecording(data).unwrap();
                toast("Recording added successfully");
            }
            setIsAddDialogOpen(false);
            setEditingRecording(null);
            form.reset();
        } catch (error) {
            toast("Failed to save recording");
        }
    };

    const handleEdit = (recording: Recording) => {
        setEditingRecording(recording);
        form.reset({
            course: typeof recording.course === 'string' ? recording.course : recording.course?._id,
            title: recording.title,
            description: recording.description || "",
            videoUrl: recording.videoUrl,
            videoType: recording.videoType,
        });
        setIsAddDialogOpen(true);
    };

    const handleDelete = async (recordingId: string) => {
        try {
            await deleteRecording(recordingId).unwrap();
            toast("Recording deleted successfully");
        } catch (error) {
            toast("Failed to delete recording");
        }
    };

    const openAddDialog = () => {
        setEditingRecording(null);
        form.reset();
        setIsAddDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Live Class Recordings</h1>
                    <p className="text-muted-foreground">
                        Manage live class recordings for courses
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAddDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Recording
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>
                                {editingRecording ? "Edit Recording" : "Add New Recording"}
                            </DialogTitle>
                            <DialogDescription>
                                Add a live class recording with video URL from YouTube or Google Drive.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="course"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a course" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {courses.map((course: any) => (
                                                        <SelectItem key={course._id} value={course._id}>
                                                            {course.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Recording title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Recording description" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="videoType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Video Type</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select video type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="youtube">YouTube</SelectItem>
                                                    <SelectItem value="gdrive">Google Drive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="videoUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Video URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://youtube.com/watch?v=... or https://drive.google.com/file/d/..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsAddDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editingRecording ? "Update" : "Add"} Recording
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Recordings</CardTitle>
                    <CardDescription>
                        View and manage all live class recordings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Video Type</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recordingsLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        Loading recordings...
                                    </TableCell>
                                </TableRow>
                            ) : recordings.map((recording: any) => (
                                <TableRow key={recording._id}>
                                    <TableCell className="font-medium">
                                        {typeof recording.course === 'string' ? 'Unknown Course' : recording.course?.title || "Unknown Course"}
                                    </TableCell>
                                    <TableCell>{recording.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={recording.videoType === "youtube" ? "default" : "secondary"}>
                                            {recording.videoType === "youtube" ? "YouTube" : "Google Drive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(recording.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(recording.videoUrl, '_blank')}
                                            >
                                                <Play className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(recording)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(recording._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {recordings.length === 0 && !recordingsLoading && (
                        <div className="text-center py-8 text-muted-foreground">
                            No recordings found. Add your first recording to get started.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}