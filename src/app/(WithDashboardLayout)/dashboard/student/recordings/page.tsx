/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, BookOpen, Loader2, Video, Calendar, Clock } from "lucide-react";
import { useGetStudentRecordingsQuery, useIncrementRecordingViewMutation, Recording } from "@/redux/features/recording/recordingApi";
import { format } from "date-fns";

export default function StudentRecordingsPage() {
    const [playingRecording, setPlayingRecording] = useState<Recording | null>(null);

    const { data: recordings, isLoading, error } = useGetStudentRecordingsQuery();
    const [incrementView] = useIncrementRecordingViewMutation();

    // Debug logging
    console.log('Student Recordings:', {
        recordings,
        isLoading,
        error,
        count: recordings?.length || 0
    });

    // Group recordings by course
    const recordingsByCourse = (recordings || []).reduce((acc: Record<string, Recording[]>, recording: Recording) => {
        const courseTitle = typeof recording.courseId === "object" ? recording.courseId.title : "Unknown Course";

        if (!acc[courseTitle]) {
            acc[courseTitle] = [];
        }
        acc[courseTitle].push(recording);
        return acc;
    }, {});

    const handlePlayRecording = async (recording: Recording) => {
        setPlayingRecording(recording);
        // Increment view count
        try {
            await incrementView(recording._id);
        } catch (error) {
            console.error("Failed to increment view count:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Live Class Recordings</h1>
                    <p className="text-muted-foreground">
                        Watch recordings of live classes for your enrolled courses
                    </p>
                </div>
            </div>

            {isLoading ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                        <p>Loading recordings...</p>
                    </CardContent>
                </Card>
            ) : Object.keys(recordingsByCourse).length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Recordings Available</h3>
                        <p className="text-muted-foreground">
                            There are no live class recordings available for your enrolled courses yet.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {Object.entries(recordingsByCourse).map(([courseTitle, courseRecordings]) => (
                        <Card key={courseTitle}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    {courseTitle}
                                </CardTitle>
                                <CardDescription>
                                    {courseRecordings.length} recording{courseRecordings.length !== 1 ? 's' : ''} available
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Batch</TableHead>
                                            <TableHead>Session Date</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Source</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {courseRecordings.map((recording: Recording) => (
                                            <TableRow key={recording._id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Video className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium">{recording.title}</p>
                                                            {recording.description && (
                                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                                    {recording.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {typeof recording.batchId === "object" ? recording.batchId.title : "N/A"}
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
                                                <TableCell>
                                                    <Badge variant={recording.videoSource === "youtube" ? "default" : "secondary"}>
                                                        {recording.videoSource === "youtube" ? "YouTube" : "Google Drive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePlayRecording(recording)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Play className="h-4 w-4" />
                                                        Watch
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Video Player Dialog */}
            <Dialog open={!!playingRecording} onOpenChange={() => setPlayingRecording(null)}>
                <DialogContent className="max-w-4xl w-full">
                    <DialogHeader>
                        <DialogTitle>{playingRecording?.title}</DialogTitle>
                    </DialogHeader>
                    {playingRecording && (
                        <div className="aspect-video w-full">
                            <iframe
                                src={playingRecording.videoUrl}
                                className="w-full h-full rounded-lg"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                title={playingRecording.title}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}