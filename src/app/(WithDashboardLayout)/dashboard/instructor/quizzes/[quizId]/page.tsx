export const instant = false

import InstructorQuizzesQuizidClient from "./_components/InstructorQuizzesQuizidClient"

export default function Page(props: Record<string, unknown>) {
  return <InstructorQuizzesQuizidClient {...props} />;
}
