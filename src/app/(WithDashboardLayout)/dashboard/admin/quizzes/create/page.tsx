export const instant = false

import QuizzesCreateClient from "./_components/QuizzesCreateClient"

export default function Page(props: Record<string, unknown>) {
  return <QuizzesCreateClient {...props} />;
}
