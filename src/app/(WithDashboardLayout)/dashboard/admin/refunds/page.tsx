export const instant = false

import { RefundsClient } from "./_components/RefundsClient"

export default function AdminRefundsPage(props: Record<string, unknown>) {
  return <RefundsClient {...props} />;
}