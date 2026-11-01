export const instant = false

import GrantAccessClient from "./_components/GrantAccessClient"

export default function Page(props: Record<string, unknown>) {
  return <GrantAccessClient {...props} />;
}
