/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGetStudentDashboardDataQuery } from "@/redux/features/student/studentApi";
import thumbnail from "../../../../../assets/images/course-thumbnail.png";
export default function StudentCourses() {
  // Get enrolled courses from student dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useGetStudentDashboardDataQuery(undefined);

  const enrolledCourses = dashboardData?.data?.enrolledCourses || [];
  console.log("dashboardData", dashboardData);
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
        <div className="grid gap-6">
          {enrolledCourses.map((enrollment: any) => (
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
                    />
                  </div>

                  {/* Right side - Details */}
                  <div className="flex-1 p-4">
                    <div className="space-y-5">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <BookOpen className="h-5 w-5" />
                          {enrollment.courseTitle}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          <div className=" flex items-center gap-2">
                            <p className="">
                              By {enrollment?.instructor?.name || "Mithun Sarkar"} &mdash;
                            </p>
                            {enrollment.batchTitle}
                            {/* ({enrollment.batchCode}) */}
                          </div>
                          <p className="">
                            {enrollment?.shortDescription}
                          </p>


                        </CardDescription>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link href={`/dashboard/student/courses/${enrollment.courseId}`}>
                          <Button size="sm">
                            Continue Course
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
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