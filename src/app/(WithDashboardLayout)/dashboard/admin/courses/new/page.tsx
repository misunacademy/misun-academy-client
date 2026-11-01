export const instant = false

import CourseForm from "../components/CourseForm";

export default function NewCoursePage() {
  return <CourseForm isNew={true} />;
}