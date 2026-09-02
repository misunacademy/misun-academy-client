import DashboardShell from "./dashboard/_components/DashboardShell"

export const instant = false

export default function Layout({ children }: { children: React.ReactNode }) {
    return <DashboardShell>{children}</DashboardShell>
}
