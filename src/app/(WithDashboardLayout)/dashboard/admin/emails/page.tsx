export const instant = false

import AdminEmailsClient from "./_components/AdminEmailsClient"

export default function Page(props: Record<string, unknown>) {
  return <AdminEmailsClient {...props} />
}
