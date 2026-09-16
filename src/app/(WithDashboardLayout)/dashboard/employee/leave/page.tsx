export const instant = false

import EmployeeLeaveClient from "./_components/EmployeeLeaveClient"

export default function Page(props: Record<string, unknown>) {
  return <EmployeeLeaveClient {...props} />
}
