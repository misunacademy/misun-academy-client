export const instant = false

import InstructorQuizzesQuizidAnalyticsClient from "./_components/InstructorQuizzesQuizidAnalyticsClient"

export default function Page({ params }: { params: Promise<{ quizId: string }> }) {
  return <InstructorQuizzesQuizidAnalyticsClient params={params} />;
}
