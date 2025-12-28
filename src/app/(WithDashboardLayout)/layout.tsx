"use client"
import { AppSidebar } from "@/components/module/dashboard/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, User, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AuthGuard from "@/components/shared/AuthGuard"
import { usePathname } from "next/navigation"



export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Function to get page title from pathname
    const getPageTitle = (path: string) => {
        const pathMap: Record<string, string> = {
            '/dashboard': 'Overview',
            '/dashboard/admin': 'Admin Dashboard',
            '/dashboard/admin/courses': 'Courses Management',
            '/dashboard/admin/recordings': 'Live Class Recordings',
            '/dashboard/admin/student': 'Student Management',
            '/dashboard/admin/payment': 'Payment Management',
            '/dashboard/admin/batch': 'Batch Management',
            '/dashboard/admin/users': 'User Management',
            '/dashboard/admin/reports': 'Reports',
            '/dashboard/admin/settings': 'Settings',
            '/dashboard/student': 'Student Dashboard',
            '/dashboard/student/courses': 'My Courses',
            '/dashboard/student/recordings': 'Live Class Recordings',
            '/dashboard/student/certificates': 'Certificates',
            '/dashboard/student/profile': 'Profile',
            '/dashboard/student/settings': 'Settings',
        }

        return pathMap[path] || 'Overview'
    }

    // Function to get header title from pathname
    const getHeaderTitle = (path: string) => {
        if (path.startsWith('/dashboard/admin')) {
            return 'Admin Dashboard'
        } else if (path.startsWith('/dashboard/student')) {
            return 'Student Dashboard'
        }
        return 'Dashboard'
    }

    const currentPageTitle = getPageTitle(pathname)
    const currentHeaderTitle = getHeaderTitle(pathname)
    return (
        <AuthGuard>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold hidden sm:block">{currentHeaderTitle}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        {/* <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search courses, certificates..."
                                className="pl-9 w-64"
                            />
                        </div> */}

                        {/* Notifications */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-4 w-4" />
                                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">New course available</p>
                                        <p className="text-xs text-muted-foreground">React Advanced Patterns is now live</p>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">Certificate earned</p>
                                        <p className="text-xs text-muted-foreground">Congratulations on completing JavaScript Basics</p>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">Assignment due</p>
                                        <p className="text-xs text-muted-foreground">Web Development project due in 2 days</p>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* View Site Button */}
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/" className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                <span className="hidden sm:inline">View Site</span>
                            </Link>
                        </Button>

               
                    </div>
                </header>
                <div className="flex-1 space-y-6 p-4 md:p-6 pt-6 bg-gray-50/50 min-h-screen">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span className="text-foreground font-medium">{currentPageTitle}</span>
                    </nav>

                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
        </AuthGuard>
    )
}