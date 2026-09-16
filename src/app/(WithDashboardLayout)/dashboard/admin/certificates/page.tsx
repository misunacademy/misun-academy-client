export const instant = false

import CertificatesClient from "./_components/CertificatesClient"

export default function Page(props: Record<string, unknown>) {
  return <CertificatesClient {...props} />;
}
