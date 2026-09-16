export const instant = false

import InstructorQuizzesQuizidAnalyticsClient from "./_components/InstructorQuizzesQuizidAnalyticsClient"

export default function Page(props: Record<string, unknown>) {
  return <InstructorQuizzesQuizidAnalyticsClient {...props} />;
}
