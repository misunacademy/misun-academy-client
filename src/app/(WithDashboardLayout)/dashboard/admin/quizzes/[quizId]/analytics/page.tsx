export const instant = false

import QuizzesQuizidAnalyticsClient from "./_components/QuizzesQuizidAnalyticsClient"

export default function Page(props: Record<string, unknown>) {
  return <QuizzesQuizidAnalyticsClient {...props} />;
}
