export const instant = false

import BootcampStudentsClient from "./_components/BootcampStudentsClient"

export default function Page(props: Record<string, unknown>) {
  return <BootcampStudentsClient {...props} />;
}
