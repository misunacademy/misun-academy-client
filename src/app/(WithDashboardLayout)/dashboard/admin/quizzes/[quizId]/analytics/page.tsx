export const instant = false

import QuizzesQuizidAnalyticsClient from "./_components/QuizzesQuizidAnalyticsClient"

export default function Page({ params }: { params: Promise<{ quizId: string }> }) {
  return <QuizzesQuizidAnalyticsClient params={params} />;
}
