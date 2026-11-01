export const instant = false

import AnnouncementsClient from "./_components/AnnouncementsClient"

export default function Page(props: Record<string, unknown>) {
  return <AnnouncementsClient {...props} />;
}
