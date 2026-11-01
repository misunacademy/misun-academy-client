"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { CourseStats } from "@/app/(WithDashboardLayout)/dashboard/admin/courses/components/CourseStats";
import { CoursesTable } from "@/app/(WithDashboardLayout)/dashboard/admin/courses/components/CoursesTable";
import { Course } from "@/types/common";
import { useGetAllCoursesQuery, useDeleteCourseMutation } from "@/redux/api/courseApi";
import { toast } from "sonner";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import ConfirmDialog from "@/components/shared/ConfirmDialog";



export default function AdminCourses() {
  const router = useRouter();

  const { data: coursesData, refetch } = useGetAllCoursesQuery({});
  const [deleteCourse] = useDeleteCourseMutation();

  const courses = (coursesData?.data || []) as Course[];
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddNewCourse = () => {
    router.push("/dashboard/admin/courses/new");
  };

  const handleEditCourse = (course: Course) => {
    router.push(`/dashboard/admin/courses/${course._id}`);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCourse(courseToDelete).unwrap();
      toast.success("Course deleted successfully");
      setCourseToDelete(null);
      refetch();
    } catch (err) {
      toast.error((err as Error)?.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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


          <CoursesTable courses={courses} onEditCourse={handleEditCourse} onDeleteCourse={(id) => { if (id) setCourseToDelete(String(id)); }} />
        </>
      }
    />
    <ConfirmDialog
      open={courseToDelete !== null}
      onOpenChange={(open) => { if (!open) setCourseToDelete(null); }}
      title="Delete this course?"
      description="Its batches, modules, lessons and quizzes become orphaned. This cannot be undone."
      confirmLabel="Delete Course"
      confirming={isDeleting}
      onConfirm={handleDeleteCourse}
    />
    </>

  );
}
