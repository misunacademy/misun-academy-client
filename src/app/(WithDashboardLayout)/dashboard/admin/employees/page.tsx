export const instant = false

import AdminEmployeesClient from "./_components/AdminEmployeesClient"

export default function Page(props: Record<string, unknown>) {
  return <AdminEmployeesClient {...props} />
}
