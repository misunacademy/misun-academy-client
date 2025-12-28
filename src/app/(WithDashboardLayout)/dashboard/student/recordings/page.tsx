/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, BookOpen } from "lucide-react";
import { useGetRecordingsQuery } from "@/redux/features/recording/recordingApi";
import { useGetStudentDashboardDataQuery } from "@/redux/features/student/studentApi";
import { Course } from "@/types/common";

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

export default function StudentRecordingsPage() {
    const [playingRecording, setPlayingRecording] = useState<Recording | null>(null);

    const { data: recordingsData, isLoading: recordingsLoading } = useGetRecordingsQuery({});
    const { data: dashboardData, isLoading: dashboardLoading } = useGetStudentDashboardDataQuery({});
    const recordings = recordingsData?.data || [];
    const enrolledCourses = Array.isArray(dashboardData?.data?.enrolledCourses) ? dashboardData.data.enrolledCourses : [];
    // Filter recordings to only show for enrolled courses
    const enrolledCourseIds = enrolledCourses.map((course: any) => course.courseId);
    const accessibleRecordings = recordings.filter((recording: Recording) => {
        const courseId = typeof recording.course === 'string' ? recording.course : recording.course?._id;
        return enrolledCourseIds.includes(courseId);
    });

    // Group recordings by course
    const recordingsByCourse = accessibleRecordings.reduce((acc: Record<string, Recording[]>, recording: Recording) => {
        const courseId = typeof recording.course === 'string' ? recording.course : recording.course?._id;
        const enrolledCourse = enrolledCourses.find((course: Course) => course._id === courseId);
        const courseTitle = enrolledCourse?.title || (typeof recording.course === 'string' ? 'Unknown Course' : recording.course?.title || 'Unknown Course');

        if (!acc[courseTitle]) {
            acc[courseTitle] = [];
        }
        acc[courseTitle].push(recording);
        return acc;
    }, {});

    const handlePlayRecording = (recording: Recording) => {
        setPlayingRecording(recording);
    };

    const getEmbedUrl = (videoUrl: string, videoType: "youtube" | "gdrive") => {
        if (videoType === "youtube") {
            // Convert YouTube watch URL to embed URL
            const videoId = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
            return videoId ? `https://www.youtube.com/embed/${videoId}` : videoUrl;
        } else if (videoType === "gdrive") {
            // Convert Google Drive share URL to embed URL
            const fileId = videoUrl.match(/\/file\/d\/([^\/\?]+)/)?.[1];
            return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : videoUrl;
        }
        return videoUrl;
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

            {recordingsLoading || dashboardLoading ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
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
                                    {Array.isArray(courseRecordings) ? courseRecordings.length : 0} recording{Array.isArray(courseRecordings) && courseRecordings.length !== 1 ? 's' : ''} available
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Video Type</TableHead>
                                            <TableHead>Recorded Date</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.isArray(courseRecordings) && courseRecordings.map((recording: Recording) => (
                                            <TableRow key={recording._id}>
                                                <TableCell className="font-medium">{recording.title}</TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {recording.description || "No description"}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={recording.videoType === "youtube" ? "default" : "secondary"}>
                                                        {recording.videoType === "youtube" ? "YouTube" : "Google Drive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(recording.createdAt).toLocaleDateString()}</TableCell>
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
                                src={getEmbedUrl(playingRecording.videoUrl, playingRecording.videoType)}
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