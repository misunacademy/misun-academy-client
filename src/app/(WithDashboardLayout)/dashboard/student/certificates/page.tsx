"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Download, Calendar, Award } from "lucide-react";
import { useGetStudentDashboardDataQuery } from "@/redux/features/student/studentApi";
import { Loader2 } from "lucide-react";

export default function StudentCertificates() {
  const { data: dashboardData, isLoading } = useGetStudentDashboardDataQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const completedCoursesCount = dashboardData?.completedCoursesCount || 0;
  const enrolledCourses = dashboardData?.enrolledCourses || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Certificates</h1>
        <p className="text-muted-foreground">View and download your earned certificates.</p>
      </div>

      {completedCoursesCount === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Complete your enrolled courses to earn certificates. Keep learning!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder for future certificate display */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Certificate System
                </CardTitle>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <CardDescription>Certificate generation in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Available when course completed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>Grade: Available upon completion</span>
                </div>
                <Button className="w-full" size="sm" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Certificate Statistics</CardTitle>
          <CardDescription>Your achievement summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completedCoursesCount}</div>
              <p className="text-sm text-muted-foreground">Completed Courses</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {enrolledCourses.length > 0 ? Math.round((completedCoursesCount / enrolledCourses.length) * 100) : 0}%
              </div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">-</div>
              <p className="text-sm text-muted-foreground">Average Grade</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}