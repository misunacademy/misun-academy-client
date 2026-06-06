"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { CourseStats } from "@/app/(WithDashboardLayout)/dashboard/admin/courses/components/CourseStats";
import { CoursesTable } from "@/app/(WithDashboardLayout)/dashboard/admin/courses/components/CoursesTable";
import { Course } from "@/types/common";
import { useGetAllCoursesQuery, useDeleteCourseMutation } from "@/redux/api/courseApi";
import { toast } from "sonner";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";



export default function AdminCourses() {
  const router = useRouter();

  const { data: coursesData, refetch } = useGetAllCoursesQuery({});
  const [deleteCourse] = useDeleteCourseMutation();

  const courses = (coursesData?.data || []) as Course[];

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

    <DashboardPageContainer
      heading="Courses Management"
      subheading="Manage all courses and their content"
      buttons={<Button className="flex items-center gap-2" onClick={handleAddNewCourse}>
        <Plus className="h-4 w-4" />
        Add New Course
      </Button>}
      content={
        <>
          <CourseStats />
          {/* <CourseFiltersCard /> */}
          <CoursesTable courses={courses} onEditCourse={handleEditCourse} onDeleteCourse={(id) => handleDeleteCourse(id)} />
        </>
      }
    />

  );
}
