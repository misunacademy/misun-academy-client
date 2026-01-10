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
        <p className="text-red-500">প্রগতি তথ্য লোড করতে ব্যর্থ হয়েছে</p>
      </div>
    );
  }

  const calculateOverallProgress = () => {
    if (activeEnrollments.length === 0) return 0;
    const total = activeEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0);
    return Math.round(total / activeEnrollments.length);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">আমার প্রগতি</h1>
        <p className="text-muted-foreground">কোর্স সম্পন্নকরণ এবং শেখার অগ্রগতি ট্র্যাক করুন</p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            সার্বিক অগ্রগতি
          </CardTitle>
          <CardDescription>সকল এনরোল করা কোর্সের গড় অগ্রগতি</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">সম্পন্ন হয়েছে</span>
              <span className="font-semibold">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Course-wise Progress */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">সক্রিয় কোর্স ({activeEnrollments.length})</TabsTrigger>
          <TabsTrigger value="completed">সম্পন্ন কোর্স</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeEnrollments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">কোনো সক্রিয় কোর্স নেই</p>
              </CardContent>
            </Card>
          ) : (
            activeEnrollments.map((enrollment) => {
              const progress = enrollment.progress || 0;
              const completedLessons = enrollment.completedLessons?.length || 0;
              const totalLessons = enrollment.course?.totalLessons || 0;

              return (
                <Card key={enrollment._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {enrollment.course?.title || 'কোর্স তথ্য নেই'}
                        </CardTitle>
                        <CardDescription>
                          ব্যাচ: {enrollment.batch?.title || 'N/A'}
                        </CardDescription>
                      </div>
                      <Badge variant={progress === 100 ? "default" : "secondary"}>
                        {progress === 100 ? "সম্পন্ন" : "চলমান"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">কোর্স অগ্রগতি</span>
                        <span className="font-semibold">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">পাঠ</p>
                          <p className="font-semibold">{completedLessons}/{totalLessons}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">ভিডিও দেখা হয়েছে</p>
                          <p className="font-semibold">{enrollment.watchedVideos?.length || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">কুইজ স্কোর</p>
                          <p className="font-semibold">{enrollment.quizScore || 0}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Enrollment Date */}
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      এনরোল করেছেন: {new Date(enrollment.createdAt).toLocaleDateString('bn-BD')}
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
              <p className="text-muted-foreground">এখনো কোনো কোর্স সম্পন্ন করেননি</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
