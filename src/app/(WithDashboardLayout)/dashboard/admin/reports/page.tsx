export const instant = false

import ReportsClient from "./_components/ReportsClient"

export default function Page(props: Record<string, unknown>) {
  return <ReportsClient {...props} />;
}
