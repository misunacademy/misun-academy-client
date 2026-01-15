"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, BookOpen, Video, Award, TrendingUp } from "lucide-react";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";

export default function ProgressPage() {
  const { data, isLoading, error } = useGetEnrollmentsQuery();
  const enrollments = data?.data || [];
  const activeEnrollments = enrollments.filter((e) => e.status.toLowerCase() === 'active');
  console.log(activeEnrollments);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load progress data</p>
      </div>
    );
  }

  const calculateOverallProgress = () => {
    if (activeEnrollments.length === 0) return 0;
    const total = activeEnrollments.reduce((sum, e) => sum + (e.progress?.overallProgress || 0), 0);
    return Math.round(total / activeEnrollments.length);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Progress</h1>
        <p className="text-muted-foreground">Track course completion and learning progress</p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Progress
          </CardTitle>
          <CardDescription>Average progress of all enrolled courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-semibold">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Course-wise Progress */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Courses ({activeEnrollments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeEnrollments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active courses</p>
              </CardContent>
            </Card>
          ) : (
            activeEnrollments.map((enrollment) => {
              const progress = enrollment.progress?.overallProgress || 0;
              const completedLessons = enrollment.completedLessons?.length || 0;
              const totalLessons = enrollment.course?.totalLessons || 0;

              return (
                <Card key={enrollment._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {enrollment.batchId?.courseId?.title || 'No course information'}
                        </CardTitle>
                        <CardDescription>
                          Batch: {enrollment.batchId?.title || 'N/A'}
                        </CardDescription>
                      </div>
                      <Badge variant={progress === 100 ? "default" : "secondary"}>
                        {progress === 100 ? "Completed" : "Ongoing"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Course Progress</span>
                        <span className="font-semibold">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Lessons</p>
                          <p className="font-semibold">{completedLessons}/{totalLessons}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Videos Watched</p>
                          <p className="font-semibold">{enrollment.watchedVideos?.length || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* <Award className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Quiz Score</p>
                          <p className="font-semibold">{enrollment.quizScore || 0}%</p>
                        </div> */}
                      </div>
                    </div>

                    {/* Enrollment Date */}
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Enrolled on: {new Date(enrollment.createdAt).toLocaleDateString('en-US')}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No courses completed yet</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
