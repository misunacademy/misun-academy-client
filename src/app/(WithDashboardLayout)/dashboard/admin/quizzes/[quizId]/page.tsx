export const instant = false

import QuizzesQuizidClient from "./_components/QuizzesQuizidClient"

export default function Page(props: Record<string, unknown>) {
  return <QuizzesQuizidClient {...props} />;
}
