export const instant = false

import QuizzesClient from "./_components/QuizzesClient"

export default function Page(props: Record<string, unknown>) {
  return <QuizzesClient {...props} />;
}
