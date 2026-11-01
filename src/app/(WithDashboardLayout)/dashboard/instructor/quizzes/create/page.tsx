export const instant = false

import InstructorQuizzesCreateClient from "./_components/InstructorQuizzesCreateClient"

export default function Page(props: Record<string, unknown>) {
  return <InstructorQuizzesCreateClient {...props} />;
}
