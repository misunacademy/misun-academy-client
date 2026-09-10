export const instant = false

import EmployeeClient from "./_components/EmployeeClient"

export default function Page(props: Record<string, unknown>) {
  return <EmployeeClient {...props} />
}
