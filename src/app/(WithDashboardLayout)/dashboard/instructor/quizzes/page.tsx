export const instant = false

import InstructorQuizzesClient from "./_components/InstructorQuizzesClient"

export default function Page(props: Record<string, unknown>) {
  return <InstructorQuizzesClient {...props} />;
}
