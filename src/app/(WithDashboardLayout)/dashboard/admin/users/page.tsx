export const instant = false

import UsersClient from "./_components/UsersClient"

export default function Page(props: Record<string, unknown>) {
  return <UsersClient {...props} />;
}
