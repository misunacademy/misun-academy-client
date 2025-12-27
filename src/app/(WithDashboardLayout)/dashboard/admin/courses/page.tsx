"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { CourseStats } from "@/components/module/dashboard/admin/CourseStats";
import { CoursesTable } from "@/components/module/dashboard/admin/CoursesTable";
import { Course } from "@/types/common";
import { useGetCoursesQuery, useDeleteCourseMutation } from "@/redux/features/course/courseApi";
import { toast } from "sonner";



export default function AdminCourses() {
  const router = useRouter();

  const { data: coursesData, refetch } = useGetCoursesQuery({});
  const [deleteCourse] = useDeleteCourseMutation();

  const courses = (coursesData?.data || []) as Course[];

  // Normalize dates for display
  const normalizedCourses: Course[] = courses.map((c) => ({
    ...c,
    enrollmentStartDate: c.enrollment?.startDate ? new Date(c.enrollment.startDate) : undefined,
    enrollmentEndDate: c.enrollment?.endDate ? new Date(c.enrollment.endDate) : undefined,
    courseStartDate: c.enrollment?.startDate ? new Date(c.enrollment.startDate) : undefined,
    courseEndDate: c.enrollment?.endDate ? new Date(c.enrollment.endDate) : undefined,
    enrollmentDeadline: c.enrollment?.enrollmentDeadline ? new Date(c.enrollment.enrollmentDeadline) : undefined,
  }));

  const handleAddNewCourse = () => {
    router.push("/dashboard/admin/courses/new");
  };

  const handleEditCourse = (course: Course) => {
    router.push(`/dashboard/admin/courses/${course._id}`);
  };

  const handleDeleteCourse = async (courseId: string | number | undefined) => {
    if (!courseId) return;
    const id = String(courseId);
    try {
      await deleteCourse(id).unwrap();
      toast.success("Course deleted successfully");
      refetch();
    } catch (err) {
      toast.error((err as Error)?.message || "Delete failed");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses Management</h1>
          <p className="text-muted-foreground">Manage all courses and their content</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddNewCourse}>
          <Plus className="h-4 w-4" />
          Add New Course
        </Button>
      </div>

      <CourseStats />

      <CoursesTable courses={normalizedCourses} onEditCourse={handleEditCourse} onDeleteCourse={(id) => handleDeleteCourse(id)} />

      {/* Removed EditCourseDialog - now using page-based forms */}
    </div>
  );
}