"use client";
import { BookOpen, ChevronUp, FileText, Home, Award, User2, Settings, Group, DollarSign, Users, LogOut, Video, Search, CreditCard, TrendingUp, ShieldCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from 'next/link';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useEnrollment } from "@/hooks/useEnrollment";
import { Role } from "@/types/common";

// Base menu items for all students (enrolled or not)
const baseStudentItems = [
    {
        title: "Dashboard",
        url: "/dashboard/student",
        icon: Home,
    },
    {
        title: "Browse Courses",
        url: "/dashboard/student/browse",
        icon: Search,
    },
];

// Menu items only for enrolled students
const enrolledOnlyItems = [
    {
        title: "My Courses",
        url: "/dashboard/student/courses",
        icon: BookOpen,
        requiresEnrollment: true,
    },
    {
        title: "Progress Tracking",
        url: "/dashboard/student/progress",
        icon: TrendingUp,
        requiresEnrollment: true,
    },
    {
        title: "Live Class Recordings",
        url: "/dashboard/student/recordings",
        icon: Video,
        requiresEnrollment: true,
    },
    {
        title: "Certificates",
        url: "/dashboard/student/certificates",
        icon: Award,
        requiresEnrollment: true,
    },
];

// Bottom menu items for all students
const bottomStudentItems = [
    {
        title: "Payment History",
        url: "/dashboard/student/payments",
        icon: CreditCard,
    },
    {
        title: "Profile",
        url: "/dashboard/student/profile",
        icon: User2,
    },
    {
        title: "Settings",
        url: "/dashboard/student/settings",
        icon: Settings,
    },
];

const adminItems = [
    {
        title: "Dashboard",
        url: "/dashboard/admin",
        icon: Home,
    },
    {
        title: "Course Management",
        url: "/dashboard/admin/courses",
        icon: BookOpen,
    },
    {
        title: "Batch Management",
        url: "/dashboard/admin/batch",
        icon: Group,
    },
    {
        title: "Student Management",
        url: "/dashboard/admin/student",
        icon: User2,
    },
    {
        title: "Live Class Recordings",
        url: "/dashboard/admin/recordings",
        icon: Video,
    },
    {
        title: "Certificate Approval",
        url: "/dashboard/admin/certificates",
        icon: ShieldCheck,
    },
    {
        title: "Payment Management",
        url: "/dashboard/admin/payment",
        icon: DollarSign,
    },
    {
        title: "Reports",
        url: "/dashboard/admin/reports",
        icon: FileText,
    },
    {
        title: "User Management",
        url: "/dashboard/admin/users",
        icon: Users,
    },
    {
        title: "Settings",
        url: "/dashboard/admin/settings",
        icon: Settings,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const user = useAppSelector((state) => state?.auth?.user);
    const { hasEnrollments } = useEnrollment();
    
    console.log("hasEnrollments",hasEnrollments);
    // Determine if we're in admin or student dashboard based on user role
    // Handle both uppercase (API) and lowercase (enum) role values
    const userRole = user?.role?.toLowerCase() || '';
    const isAdmin = [
        Role.SUPERADMIN.toLowerCase(), 
        Role.ADMIN.toLowerCase(), 
        Role.INSTRUCTOR.toLowerCase()
    ].includes(userRole);
    
    // Build student menu based on enrollment status
    const studentItems = isAdmin ? [] : [
        ...baseStudentItems,
        ...(hasEnrollments ? enrolledOnlyItems : []),
        ...bottomStudentItems,
    ];
    
    const items = isAdmin ? adminItems : studentItems;
    
    const panelText = isAdmin ? 'Admin Panel' : 'Student Panel';

    const router = useRouter();
    const { signOut } = useAuth();

    const handleSignOut = async () => {
        const result = await signOut();
        if (result.success) {
            router.push('/auth');
        }
    };

    return (
        <Sidebar className="border-r border-gray-200">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">MISUN Academy</h2>
                        <p className="text-xs text-gray-500">{panelText}</p>
                    </div>
                </div>
            </div>

            <SidebarContent className="py-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {items.map((item) => {
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={`
                                                px-4 py-3 rounded-lg transition-all duration-200
                                                hover:bg-gray-100
                                                ${isActive
                                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md'
                                                    : 'text-gray-700'
                                                }
                                            `}
                                        >
                                            <Link href={item.url} className="flex items-center gap-3">
                                                <item.icon className="w-5 h-5" />
                                                <span className="font-medium">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-200 p-4">
                <SidebarMenu>

                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full px-4 py-3 hover:bg-gray-100 rounded-lg">
                                    <div className="flex items-center gap-3 w-full">
                                        {user?.image ? (
                                            <Image
                                                src={user.image}
                                                alt="User Avatar"
                                                width={30}
                                                height={30}
                                                className="h-8 w-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                                <User2 className="h-6 w-6 text-emerald-600" />
                                            </div>
                                        )}

                                        <div className="flex flex-col items-start truncate">
                                            <span className="text-sm font-medium text-gray-800 truncate">
                                                {user?.name || "Guest"}
                                            </span>
                                            <span className="text-xs text-gray-500 truncate">
                                                {user?.email || "No email"}
                                            </span>
                                        </div>

                                        <ChevronUp className="ml-auto w-4 h-4 text-gray-500" />
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem onClick={handleSignOut} className="flex justify-around items-center">
                                    <span>Sign Out</span>
                                    <LogOut className="mr-2 h-4 w-4 text-red-600" />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}