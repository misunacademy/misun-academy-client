export const instant = false

import QuizzesQuizidClient from "./_components/QuizzesQuizidClient"

export default function Page({ params }: { params: Promise<{ quizId: string }> }) {
  return <QuizzesQuizidClient params={params} />;
}
