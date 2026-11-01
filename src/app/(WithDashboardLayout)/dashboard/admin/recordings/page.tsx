export const instant = false

import RecordingsClient from "./_components/RecordingsClient"

export default function Page(props: Record<string, unknown>) {
  return <RecordingsClient {...props} />;
}
