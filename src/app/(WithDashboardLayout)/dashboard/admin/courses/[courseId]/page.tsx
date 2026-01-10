import { use } from "react";
import CourseForm from "../CourseForm";

interface EditCoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const { courseId } = use(params);
  return <CourseForm courseId={courseId} isNew={false} />;
}