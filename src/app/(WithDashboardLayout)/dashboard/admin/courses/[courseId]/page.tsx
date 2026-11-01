export const instant = false

import CoursesCourseidClient from "./_components/CoursesCourseidClient"

export default function Page({ params }: { params: Promise<{ courseId: string }> }) {
  return <CoursesCourseidClient params={params} />;
}
