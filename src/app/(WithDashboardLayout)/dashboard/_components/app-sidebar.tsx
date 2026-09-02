"use client";

import {
  Award,
  Bell,
  BookOpen,
  Briefcase,
  ChevronUp,
  CreditCard,
  FileText,
  GraduationCap,
  KeyRound,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  Rocket,
  Settings,
  ShieldCheck,
  TrendingUp,
  Trophy,
  User2,
  Users,
  Video,
  ClipboardCheck,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/types/common";

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const employeeGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard/employee", icon: LayoutDashboard },
      { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
    ],
  },
  {
    label: "Work",
    items: [
      { title: "Leave Management", url: "/dashboard/employee/leave", icon: Layers },
      { title: "Salary History", url: "/dashboard/employee/salary-history", icon: CreditCard },
    ],
  },
  {
    label: "Account",
    items: [{ title: "Settings", url: "/dashboard/employee/settings", icon: Settings }],
  },
];

const instructorGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard/instructor", icon: LayoutDashboard },
      { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
    ],
  },
  {
    label: "Teaching",
    items: [
      { title: "Recordings", url: "/dashboard/instructor/recordings", icon: Video },
      { title: "Students", url: "/dashboard/instructor/students", icon: User2 },
      { title: "Quizzes", url: "/dashboard/instructor/quizzes", icon: ClipboardCheck },
      { title: "Leaderboard", url: "/dashboard/instructor/leaderboard", icon: Trophy },
    ],
  },
  {
    label: "Account",
    items: [{ title: "Settings", url: "/dashboard/instructor/settings", icon: Settings }],
  },
];

function getAdminGroups(isSuperAdmin: boolean): NavGroup[] {
  const platformItems: NavItem[] = [
    { title: "Emails", url: "/dashboard/admin/emails", icon: Mail },
    { title: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ];
  if (isSuperAdmin) {
    platformItems.push({ title: "Audit Logs", url: "/dashboard/admin/audit-logs", icon: ShieldCheck });
  }

  return [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
        { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
      ],
    },
    {
      label: "Academics",
      items: [
        { title: "Courses", url: "/dashboard/admin/courses", icon: BookOpen },
        { title: "Batches", url: "/dashboard/admin/batch", icon: Layers },
        { title: "Recordings", url: "/dashboard/admin/recordings", icon: Video },
        { title: "Quizzes", url: "/dashboard/admin/quizzes", icon: ClipboardCheck },
        { title: "Certificates", url: "/dashboard/admin/certificates", icon: Award },
      ],
    },
    {
      label: "Learners",
      items: [
        { title: "Students", url: "/dashboard/admin/student", icon: Users },
        { title: "Grant Access", url: "/dashboard/admin/grant-access", icon: KeyRound },
        { title: "Progress Tracker", url: "/dashboard/admin/students-progress-tracker", icon: TrendingUp },
        { title: "Leaderboard", url: "/dashboard/admin/leaderboard", icon: Trophy },
        { title: "Bootcamps", url: "/dashboard/admin/bootcamp", icon: Rocket },
      ],
    },
    {
      label: "Commerce",
      items: [
        { title: "Payments", url: "/dashboard/admin/payment", icon: CreditCard },
        { title: "Reports", url: "/dashboard/admin/reports", icon: FileText },
      ],
    },
    {
      label: "Team",
      items: [
        { title: "Users", url: "/dashboard/admin/users", icon: Users },
        { title: "Employees", url: "/dashboard/admin/employees", icon: Briefcase },
      ],
    },
    {
      label: "Platform",
      items: platformItems,
    },
  ];
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase() || "";
  const isInstructor = userRole === Role.INSTRUCTOR.toLowerCase();
  const isAdmin = [Role.SUPERADMIN.toLowerCase(), Role.ADMIN.toLowerCase()].includes(userRole);
  const isEmployee = userRole === Role.EMPLOYEE.toLowerCase();
  const isSuperAdmin = userRole === Role.SUPERADMIN.toLowerCase();

  const groups: NavGroup[] = !user
    ? []
    : isAdmin
      ? getAdminGroups(isSuperAdmin)
      : isInstructor
        ? instructorGroups
        : isEmployee
          ? employeeGroups
          : [];

  const panelText = !user
    ? "Loading..."
    : isAdmin
      ? "Admin Panel"
      : isInstructor
        ? "Instructor Panel"
        : isEmployee
          ? "Employee Panel"
          : "Student Panel";

  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      router.push("/");
    }
  };

  const isActive = (url: string) => {
    if (url === "/dashboard/admin" || url === "/dashboard/instructor" || url === "/dashboard/employee") {
      return pathname === url;
    }
    if (url === "/dashboard/notifications") {
      return pathname === url;
    }
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-none tracking-tight text-sidebar-foreground">MISUN Academy</span>
          <span className="text-xs font-medium text-sidebar-foreground/60">{panelText}</span>
        </div>
      </div>

      <SidebarContent className="gap-0 overflow-y-auto px-2 py-3">
        {groups.map((group) => (
          <SidebarGroup key={group.label} className="p-0 pb-4">
            <SidebarGroupLabel className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/45">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={`h-9 gap-3 rounded-lg px-2.5 text-[13px] font-medium transition-all duration-200 ${
                          active
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 !text-white shadow-md hover:from-emerald-600 hover:to-emerald-700 hover:!text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-emerald-500 data-[active=true]:to-emerald-600 data-[active=true]:!text-white"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                        }`}
                      >
                        <Link href={item.url} className="flex items-center gap-3">
                          <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "!text-white" : "text-sidebar-foreground/55"}`} />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto w-full gap-3 rounded-lg px-2.5 py-2.5 hover:bg-sidebar-accent">
                  <div className="flex w-full items-center gap-3">
                    {user?.image ? (
                      <Image src={user.image} alt="User avatar" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
                        <User2 className="h-4 w-4 text-sidebar-foreground/70" />
                      </div>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                      <span className="w-full truncate text-sm font-medium leading-none text-sidebar-foreground">{user?.name || "Guest"}</span>
                      <span className="w-full truncate text-xs text-sidebar-foreground/60">{user?.email || "No email"}</span>
                    </div>
                    <ChevronUp className="ml-auto h-4 w-4 shrink-0 text-sidebar-foreground/50" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center justify-between">
                  <span>Sign out</span>
                  <LogOut className="h-4 w-4 text-destructive" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
