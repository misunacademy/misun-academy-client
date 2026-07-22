"use client"

import { AppSidebar } from "@/app/(WithDashboardLayout)/dashboard/_components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AuthGuard from "@/components/shared/AuthGuard"
import NotificationBell from "@/components/shared/NotificationBell"
import SocketProvider from "@/providers/SocketProvider"
import { usePathname } from "next/navigation"

const pageTitleMap: Record<string, string> = {
    '/dashboard/admin': 'Admin Dashboard',
    '/dashboard/admin/courses': 'Courses Management',
    '/dashboard/admin/recordings': 'Live Class Recordings',
    '/dashboard/admin/student': 'Student Management',
    '/dashboard/admin/payment': 'Payment Management',
    '/dashboard/admin/batch': 'Batch Management',
    '/dashboard/admin/users': 'User Management',
    '/dashboard/admin/employees': 'Employee Management',
    '/dashboard/admin/dynamic-updates': 'Dynamic Updates',
    '/dashboard/admin/reports': 'Reports',
    '/dashboard/admin/settings': 'Settings',
    '/dashboard/admin/students-progress-tracker': 'Students Progress Tracker',
    '/dashboard/admin/quizzes': 'Quiz Management',
    '/dashboard/admin/gamification': 'Gamification Settings',
    '/dashboard/instructor': 'Instructor Dashboard',
    '/dashboard/instructor/recordings': 'Live Class Recordings',
    '/dashboard/instructor/students': 'Student Management',
    '/dashboard/student': 'Student Dashboard',
    '/dashboard/student/browse': 'Browse Courses',
    '/dashboard/student/courses': 'My Courses',
    '/dashboard/student/recordings': 'Live Class Recordings',
    '/dashboard/student/certificates': 'Certificates',
    '/dashboard/student/enrollment-poster': 'Enrollment Poster',
    '/dashboard/student/profile': 'Profile',
    '/dashboard/student/payments': 'Payments History',
    '/dashboard/student/settings': 'Settings',
    '/dashboard/employee': 'Employee Dashboard',
    '/dashboard/employee/salaries': 'Salaries',
    '/dashboard/employee/leave': 'Leave Management',
    '/dashboard/employee/profile': 'Profile',
    '/dashboard/employee/settings': 'Settings',
}

function getPageTitle(path: string) {
    return pageTitleMap[path] || 'Overview'
}

function getHeaderTitle(path: string) {
    if (path.startsWith('/dashboard/admin')) return 'Admin Dashboard'
    if (path.startsWith('/dashboard/instructor')) return 'Instructor Dashboard'
    if (path.startsWith('/dashboard/student')) return 'Student Dashboard'
    if (path.startsWith('/dashboard/employee')) return 'Employee Dashboard'
    return 'Dashboard'
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const currentPageTitle = getPageTitle(pathname)
    const currentHeaderTitle = getHeaderTitle(pathname)

    return (
        <AuthGuard>
            <SocketProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <h1 className="text-lg font-semibold hidden sm:block">{currentHeaderTitle}</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <NotificationBell />
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/" className="flex items-center gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="hidden sm:inline">View Site</span>
                                </Link>
                            </Button>
                        </div>
                    </header>
                    <main className="flex-1 space-y-6 p-4 md:p-6 pt-6 bg-gray-50/50 min-h-screen">
                        <nav className="flex items-center space-x-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
                            <span>Dashboard</span>
                            <span>/</span>
                            <span className="text-foreground font-medium">{currentPageTitle}</span>
                        </nav>
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
            </SocketProvider>
        </AuthGuard>
    )
}
