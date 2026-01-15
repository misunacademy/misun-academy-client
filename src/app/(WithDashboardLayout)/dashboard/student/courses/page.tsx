/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Clock, Loader2, AlertCircle, Award, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGetStudentDashboardDataQuery } from "@/redux/features/student/studentApi";
import { toast } from "sonner";
import thumbnail from "../../../../../assets/images/course-thumbnail.png";

interface EnrolledCourse {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  shortDescription: string;
  instructor: { name: string } | null;
  batchTitle: string;
  batchNumber: string;
  enrolledAt: string;
  status: string;
}

export default function StudentCourses() {
  // Get enrolled courses from student dashboard data
  const { data: dashboardData, isLoading: dashboardLoading, error } = useGetStudentDashboardDataQuery(undefined);

  const enrolledCourses: EnrolledCourse[] = dashboardData?.data?.enrolledCourses || [];

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load your courses. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">Track your enrolled courses and progress.</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Courses Enrolled</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven&apos;t enrolled in any courses yet. Browse available courses to start learning.
            </p>
            <Link href="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {enrolledCourses.map((enrollment) => (
            <Card key={enrollment.id} className="overflow-hidden w-full max-w-5xl min-h-64 h-full">
              <CardContent className="p-0 h-full">
                <div className="sm:flex h-full ">
                  {/* Left side - Thumbnail */}
                  <div className="relative flex-1 flex-shrink-0">
                    <Image
                      src={thumbnail}
                      alt={enrollment.courseTitle}
                      height={64}
                      width={256}
                      className="object-cover h-full w-full"
                      priority={false}
                    />
                  </div>

                  {/* Right side - Details */}
                  <div className="flex-1 p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 text-xl mb-2">
                            <BookOpen className="h-5 w-5" />
                            {enrollment.courseTitle}
                          </CardTitle>
                          <CardDescription className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p>
                                By {enrollment?.instructor?.name || "Mithun Sarkar"} • {enrollment.batchTitle}
                              </p>
                            </div>
                            {enrollment.shortDescription && (
                              <p className="mt-2 line-clamp-2">
                                {enrollment.shortDescription}
                              </p>
                            )}
                          </CardDescription>
                        </div>
                        
                        {/* Status Badge */}
                        <Badge 
                          variant={
                            enrollment.status === 'active' ? 'default' : 
                            enrollment.status === 'completed' ? 'secondary' : 
                            'outline'
                          }
                          className="capitalize"
                        >
                          {enrollment.status}
                        </Badge>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 py-3 border-y">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Enrolled</span>
                            <span className="text-sm font-medium">
                              {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Progress</span>
                            <span className="text-sm font-medium">0%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Certificate</span>
                            <span className="text-sm font-medium text-muted-foreground">Pending</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {enrollment.courseId ? (
                          <Link href={`/dashboard/student/courses/${enrollment.courseId}`}>
                            <Button size="sm">
                              Continue Learning
                            </Button>
                          </Link>
                        ) : (
                          <Button size="sm" disabled>
                            Course Unavailable
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast.info("Course outline feature coming soon!")}
                        >
                          Course Outline
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}