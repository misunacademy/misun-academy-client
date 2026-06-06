'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, DollarSign, CalendarDays } from 'lucide-react';
import {
    useGetAllEmployeesQuery,
    useGetAllSalariesAdminQuery,
    useGetAllLeaveRequestsAdminQuery,
} from '@/redux/api/employeeAdminApi';
import DashboardPageContainer from '@/components/layout/DashboardPageContainer';

import { AdminEmployeeStats } from './(components)/AdminEmployeeStats';
import { EmployeeListTab } from './(components)/EmployeeListTab';
import { SalaryManagementTab } from './(components)/SalaryManagementTab';
import { LeaveManagementTab } from './(components)/LeaveManagementTab';

const AdminEmployeesPage = () => {
    /* ── Summary data for stats ─────────────────────────────────────────────── */
    const { data: empData } = useGetAllEmployeesQuery({ limit: 1 });
    const { data: salaryData } = useGetAllSalariesAdminQuery({ limit: 200 });
    const { data: leaveData } = useGetAllLeaveRequestsAdminQuery({ status: 'Pending', limit: 200 });

    const totalEmployees = empData?.data?.total ?? 0;
    const allSalaries = salaryData?.data?.salaries ?? [];
    const paidSalaries = allSalaries.filter((s) => s.status === 'Paid');
    const pendingSalaries = allSalaries.filter((s) => s.status === 'Pending');
    const totalSalaryPaid = paidSalaries.reduce((a, s) => a + (s.totalAmount ?? 0), 0);
    const totalBonus = paidSalaries.reduce((a, s) => a + (s.bonus ?? 0), 0);
    const pendingLeaves = leaveData?.data?.total ?? 0;

    return (
        <DashboardPageContainer
            heading="Employee Management"
            subheading="Manage employee records, payroll, and leave requests."
            content={
                <div className="space-y-6">
                    {/* Stats */}
                    <AdminEmployeeStats
                        totalEmployees={totalEmployees}
                        totalSalaryPaid={totalSalaryPaid}
                        pendingSalaries={pendingSalaries.length}
                        paidSalaries={paidSalaries.length}
                        pendingLeaves={pendingLeaves}
                        totalBonus={totalBonus}
                    />

                    {/* Tabs */}
                    <Tabs defaultValue="employees">
                        <TabsList>
                            <TabsTrigger value="employees" className="gap-2">
                                <Users className="w-4 h-4" />
                                Employees
                            </TabsTrigger>
                            <TabsTrigger value="salary" className="gap-2">
                                <DollarSign className="w-4 h-4" />
                                Salary
                                {pendingSalaries.length > 0 && (
                                    <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5">
                                        {pendingSalaries.length}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="leave" className="gap-2">
                                <CalendarDays className="w-4 h-4" />
                                Leave Requests
                                {pendingLeaves > 0 && (
                                    <span className="ml-1 rounded-full bg-destructive text-destructive-foreground text-xs font-bold px-1.5 py-0.5">
                                        {pendingLeaves}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="employees" className="mt-6">
                            <EmployeeListTab />
                        </TabsContent>
                        <TabsContent value="salary" className="mt-6">
                            <SalaryManagementTab />
                        </TabsContent>
                        <TabsContent value="leave" className="mt-6">
                            <LeaveManagementTab />
                        </TabsContent>
                    </Tabs>
                </div>
            }
        />
    );
};

export default AdminEmployeesPage;
