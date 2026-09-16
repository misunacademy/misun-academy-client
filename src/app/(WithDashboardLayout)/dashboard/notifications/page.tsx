export const instant = false

import NotificationsClient from "./_components/NotificationsClient"

export default function Page(props: Record<string, unknown>) {
  return <NotificationsClient {...props} />;
}
