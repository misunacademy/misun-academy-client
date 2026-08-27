import DashboardShell from "./dashboard/_components/DashboardShell"

export default function Layout({ children }: { children: React.ReactNode }) {
    return <DashboardShell>{children}</DashboardShell>
}
