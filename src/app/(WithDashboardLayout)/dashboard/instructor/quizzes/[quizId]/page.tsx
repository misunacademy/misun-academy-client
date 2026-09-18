export const instant = false

import InstructorQuizzesQuizidClient from "./_components/InstructorQuizzesQuizidClient"

export default function Page({ params }: { params: Promise<{ quizId: string }> }) {
  return <InstructorQuizzesQuizidClient params={params} />;
}
