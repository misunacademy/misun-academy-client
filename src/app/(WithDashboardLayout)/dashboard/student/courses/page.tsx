/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGetStudentDashboardDataQuery } from "@/redux/features/student/studentApi";

export default function StudentCourses() {
  // Get enrolled courses from student dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useGetStudentDashboardDataQuery(undefined);

  const enrolledCourses = dashboardData?.enrolledCourses || [];
console.log("dashboardData",dashboardData);
  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((enrollment: any) => (
            <Card key={enrollment.id}>
              <CardHeader>
                <div className="relative w-full h-32 mb-4">
                  <Image
                    src="https://via.placeholder.com/300x150?text=Course"
                    alt={enrollment.courseTitle}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {enrollment.courseTitle}
                </CardTitle>
                <CardDescription>
                  Batch: {enrollment.batchTitle} ({enrollment.batchCode})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Status</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      enrollment.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {enrollment.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/student/courses/${enrollment.id}`} className="w-full">
                    <Button className="w-full mt-4">
                      View Course
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}