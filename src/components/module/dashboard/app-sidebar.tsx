"use client";
import { BookOpen, ChevronUp, FileText, Home, Award, User2, Settings, Group, DollarSign, Users, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
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
import { logout } from "@/redux/features/auth/authSlice";
import { RootState } from "@/redux/store";
import Image from "next/image";

// Menu items - Bengali version with existing routes
const studentItems = [
    {
        title: "ড্যাশবোর্ড",
        url: "/dashboard/student",
        icon: Home,
    },
    {
        title: "আমার কোর্স",
        url: "/dashboard/student/courses",
        icon: BookOpen,
    },
    {
        title: "সার্টিফিকেট",
        url: "/dashboard/student/certificates",
        icon: Award,
    },
    {
        title: "প্রোফাইল",
        url: "/dashboard/student/profile",
        icon: User2,
    },
    {
        title: "সেটিংস",
        url: "/dashboard/student/settings",
        icon: Settings,
    },
];

const adminItems = [
    {
        title: "ড্যাশবোর্ড",
        url: "/dashboard/admin",
        icon: Home,
    },
    {
        title: "কোর্স ম্যানেজমেন্ট",
        url: "/dashboard/admin/courses",
        icon: BookOpen,
    },
    {
        title: "ব্যাচ ম্যানেজমেন্ট",
        url: "/dashboard/admin/batch",
        icon: Group,
    },
    {
        title: "স্টুডেন্ট ম্যানেজমেন্ট",
        url: "/dashboard/admin/student",
        icon: User2,
    },
    {
        title: "পেমেন্ট ম্যানেজমেন্ট",
        url: "/dashboard/admin/payment",
        icon: DollarSign,
    },
    {
        title: "রিপোর্টস",
        url: "/dashboard/admin/reports",
        icon: FileText,
    },
    {
        title: "ইউজার ম্যানেজমেন্ট",
        url: "/dashboard/admin/users",
        icon: Users,
    },
    {
        title: "সেটিংস",
        url: "/dashboard/admin/settings",
        icon: Settings,
    },
];

export function AppSidebar() {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const user = useSelector((state: RootState) => state.auth.user);
    // Determine if we're in admin or student dashboard
    const isAdmin = pathname.startsWith('/dashboard/admin');
    const items = isAdmin ? adminItems : studentItems;

    const handleSignOut = () => {
        dispatch(logout());
        window.location.href = "/auth";
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
                        <p className="text-xs text-gray-500">শিক্ষার্থী প্যানেল</p>
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
                                            <a href={item.url} className="flex items-center gap-3">
                                                <item.icon className="w-5 h-5" />
                                                <span className="font-medium">{item.title}</span>
                                            </a>
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
                                                {user?.name || "অতিথি"}
                                            </span>
                                            <span className="text-xs text-gray-500 truncate">
                                                {user?.email || "ইমেইল নেই"}
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
                                    <span>সাইন আউট</span>
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