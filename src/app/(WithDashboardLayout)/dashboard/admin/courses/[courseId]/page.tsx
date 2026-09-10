export const instant = false

import CoursesCourseidClient from "./_components/CoursesCourseidClient"

export default function Page(props: Record<string, unknown>) {
  return <CoursesCourseidClient {...props} />;
}
