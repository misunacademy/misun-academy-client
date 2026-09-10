export const instant = false

import SettingsClient from "./_components/SettingsClient"

export default function Page(props: Record<string, unknown>) {
  return <SettingsClient {...props} />;
}
