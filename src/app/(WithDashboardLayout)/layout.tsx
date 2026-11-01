import type { Metadata } from 'next';
import DashboardShell from "./dashboard/_components/DashboardShell"

export const instant = false

// Dashboards are authenticated-only — never index them.
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <DashboardShell>{children}</DashboardShell>
}
