export const instant = false

import RolesClient from "./_components/RolesClient"

export default function Page(props: Record<string, unknown>) {
  return <RolesClient {...props} />;
}
