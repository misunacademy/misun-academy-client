"use client";

import Link from "next/link";
import { useGetRoleStatsQuery } from "@/redux/api/adminApi";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, Users, GraduationCap, Briefcase, BookOpen, Crown, Loader2 } from "lucide-react";

const roleMeta: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  superadmin: { icon: Crown, color: "text-amber-600" },
  admin: { icon: ShieldCheck, color: "text-emerald-600" },
  instructor: { icon: GraduationCap, color: "text-blue-600" },
  employee: { icon: Briefcase, color: "text-slate-600" },
  learner: { icon: BookOpen, color: "text-zinc-600" },
};

type CapabilityRow = {
  label: string;
  keys: Record<string, boolean | "scoped" | "read">;
};

export default function RolesPage() {
  const { data, isLoading, isError } = useGetRoleStatsQuery();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <DashboardPageContainer
        heading="Roles"
        subheading="Failed to load role stats"
        content={<p className="text-sm text-destructive">Unable to fetch roles. Try again.</p>}
      />
    );
  }

  const { total, roles } = data.data;

  return (
    <DashboardPageContainer
      heading="Roles"
      subheading="Access control overview — who can do what. Roles are server-enforced (Better Auth), not client-assignable."
      buttons={
        <Button asChild variant="outline">
          <Link href="/dashboard/admin/users">Manage Users</Link>
        </Button>
      }
      content={
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {roles.map((r) => {
              const meta = roleMeta[r.role] ?? { icon: Users, color: "text-muted-foreground" };
              const Icon = meta.icon;
              return (
                <Card key={r.role} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Icon className={`h-5 w-5 ${meta.color}`} />
                      <Badge variant={r.role === "superadmin" ? "destructive" : r.role === "admin" ? "default" : "secondary"} className="capitalize">
                        {r.role}
                      </Badge>
                    </div>
                    <CardTitle className="pt-2 text-base">{r.label}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed">{r.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{r.count}</span>
                      <span className="text-xs text-muted-foreground">/ {total} users</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">active {r.active}</span>
                      <span className="rounded bg-amber-50 px-2 py-1 text-amber-700">suspended {r.suspended}</span>
                    </div>
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <Link href={`/dashboard/admin/users?role=${r.role}`}>View {r.label}s</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Permission matrix</CardTitle>
              <CardDescription>Industry-standard least-privilege. Server guards: requireAdmin / requireInstructor / requireEmployee / superadmin delete.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">Capability</TableHead>
                    <TableHead className="text-center">Learner</TableHead>
                    <TableHead className="text-center">Employee</TableHead>
                    <TableHead className="text-center">Instructor</TableHead>
                    <TableHead className="text-center">Admin</TableHead>
                    <TableHead className="text-center">Superadmin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {([
                    { label: "Manage users & roles", keys: { learner: false, employee: false, instructor: false, admin: true, superadmin: true } },
                    { label: "Delete users", keys: { learner: false, employee: false, instructor: false, admin: false, superadmin: true } },
                    { label: "Courses / Batches / Modules", keys: { learner: false, employee: false, instructor: "scoped", admin: true, superadmin: true } },
                    { label: "Quizzes & recordings", keys: { learner: false, employee: false, instructor: "scoped", admin: true, superadmin: true } },
                    { label: "Payments & certificates approval", keys: { learner: false, employee: false, instructor: false, admin: true, superadmin: true } },
                    { label: "Employee leave/salary approvals", keys: { learner: false, employee: false, instructor: false, admin: true, superadmin: true } },
                    { label: "Emails & campaigns", keys: { learner: false, employee: false, instructor: false, admin: true, superadmin: true } },
                    { label: "Settings & audit logs", keys: { learner: false, employee: false, instructor: false, admin: "read", superadmin: true } },
                    { label: "Own profile & leave/salary", keys: { learner: false, employee: true, instructor: true, admin: true, superadmin: true } },
                    { label: "Learn: enroll, play, quizzes", keys: { learner: true, employee: false, instructor: false, admin: false, superadmin: false } },
                  ] as CapabilityRow[]).map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="font-medium text-xs">{row.label}</TableCell>
                      {(["learner", "employee", "instructor", "admin", "superadmin"] as const).map((k) => {
                        const v = row.keys[k];
                        return (
                          <TableCell key={k} className="text-center text-xs">
                            {v === true ? <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" /> : v === "scoped" ? <Badge variant="outline" className="text-[10px]">scoped</Badge> : v === "read" ? <Badge variant="outline" className="text-[10px]">read</Badge> : <span className="text-muted-foreground">—</span>}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="pt-3 text-xs text-muted-foreground">
                Enforcement lives in <code className="rounded bg-muted px-1 py-0.5">middlewares/betterAuth.ts</code> — client cannot escalate. Role assignment is audited (<code>auditLogs</code>: user.role_change).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How to change a role</CardTitle>
              <CardDescription>Roles are not self-service. Use User Management → Edit → Role. Every change is audit-logged.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              <ol className="list-decimal space-y-1 pl-5">
                <li>Go to <Link href="/dashboard/admin/users" className="text-primary underline">Users</Link> → search user → Edit</li>
                <li>Change <code>role</code> (superadmin/admin/instructor/employee/learner) → Save</li>
                <li>Verify in <Link href="/dashboard/admin/audit-logs" className="text-primary underline">Audit Logs</Link> (action <code>user.role_change</code>)</li>
                <li>Effect is immediate; suspended users have sessions revoked.</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      }
    />
  );
}
