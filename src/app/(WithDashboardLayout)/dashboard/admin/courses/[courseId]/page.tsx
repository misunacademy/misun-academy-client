import CourseForm from "../CourseForm";

interface EditCoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { courseId } = await params;
  return <CourseForm courseId={courseId} isNew={false} />;
}