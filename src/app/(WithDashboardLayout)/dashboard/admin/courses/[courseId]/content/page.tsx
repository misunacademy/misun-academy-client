export const instant = false

import CoursesCourseidContentClient from "./_components/CoursesCourseidContentClient"

export default function Page(props: Record<string, unknown>) {
  return <CoursesCourseidContentClient {...props} />;
}
