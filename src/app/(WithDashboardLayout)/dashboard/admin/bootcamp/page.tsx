export const instant = false

import BootcampClient from "./_components/BootcampClient"

export default function Page(props: Record<string, unknown>) {
  return <BootcampClient {...props} />;
}
