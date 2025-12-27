import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, DollarSign, Loader2 } from "lucide-react";
import { useGetCoursesQuery } from "@/redux/features/course/courseApi";
import { useGetMetadataQuery } from "@/redux/features/student/studentApi";
import { Course } from "@/types/common";

export function CourseStats() {
  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery({ isPublished: true });
  const { data: dashboardData, isLoading: dashboardLoading } = useGetMetadataQuery(undefined);

  const courses = coursesData?.data || [];
  const totalCourses = courses.length;
  const activeCourses = courses.filter((course:Course) => course.isPublished).length;
  const totalStudents = dashboardData?.data?.totalEnrolled || 0;
  const totalRevenue = dashboardData?.data?.totalIncome || 0;

  if (coursesLoading || dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCourses}</div>
          <p className="text-xs text-muted-foreground">Published courses</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCourses}</div>
          <p className="text-xs text-muted-foreground">{totalCourses > 0 ? `${Math.round((activeCourses / totalCourses) * 100)}% of total` : 'No courses yet'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Enrolled students</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">BDT {totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Total earnings</p>
        </CardContent>
      </Card>
    </div>
  );
}