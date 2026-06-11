'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGetMySalariesQuery, useGetMyEmployeeProfileQuery } from '@/redux/api/employeeApi';
import DashboardPageContainer from '@/components/layout/DashboardPageContainer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { EmployeeStatCards } from './(components)/EmployeeStatCards';
import { EmployeeInfoCard } from './(components)/EmployeeInfoCard';
import { SalaryStructureCard } from './(components)/SalaryStructureCard';
import { PayableCard } from './(components)/PayableCard';
import { SalaryHistoryTable } from './(components)/SalaryHistoryTable';
import {
    UpdateInfoDialog,
    type EmployeeExtendedInfo,
} from './(components)/UpdateInfoDialog';

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function DashboardLoader() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const EmployeePage = () => {
    const { isLoading: authLoading } = useAuth();

    /* ── Server profile (extended fields) ─────────────────────────────────── */
    const { data: serverProfile, isLoading: profileLoading } = useGetMyEmployeeProfileQuery();

    /* ── Salary data ────────────────────────────────────────────────────────── */
    const { data: salaryData, isLoading: salaryLoading } = useGetMySalariesQuery({
        page: 1,
        limit: 12,
    });

    const p = serverProfile?.data;
    const extInfo: EmployeeExtendedInfo = {
        name: p?.name || '',
        phone: p?.phone || '',
        address: p?.address || '',
        whatsapp: p?.whatsapp || '',
        bloodGroup: p?.bloodGroup || '',
        nidNumber: p?.nidNumber || '',
        dateOfBirth: p?.dateOfBirth ? new Date(p.dateOfBirth).toISOString().slice(0, 10) : '',
        tshirtSize: p?.tshirtSize || '',
        designation: p?.designation || '',
        nidPhotoFrontUrl: p?.nidPhotoFrontUrl ?? p?.nidPhotoUrl ?? null,
        nidPhotoBackUrl: p?.nidPhotoBackUrl ?? null,
    };

    /* ── Dialog state ────────────────────────────────────────────────────────── */
    const [dialogOpen, setDialogOpen] = useState(false);

    /* ── Derived values ────────────────────────────────────────────────────── */
    const email =  serverProfile?.data?.email || '';
    const avatarUrl = serverProfile?.data?.image || undefined;

    const salaries = salaryData?.data?.salaries ?? [];
    const latestSalary = salaries[0];
    const grossSalary = latestSalary?.amount ?? 0;
    const latestBonus = latestSalary?.bonus ?? 0;
    const totalPaid = salaries
        .filter((s) => s.status === 'Paid')
        .reduce((acc, s) => acc + (s.totalAmount ?? 0), 0);
    const pendingCount = salaries.filter((s) => s.status === 'Pending').length;

    const initials = extInfo.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    const firstName = extInfo.name.trim().split(' ')[0] || 'Employee';
    const designationLabel = extInfo.designation.trim() || 'Not provided';

    if (authLoading || profileLoading) return <DashboardLoader />;

    return (
        <DashboardPageContainer
            heading={
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-emerald-100">
                        {avatarUrl && <AvatarImage src={avatarUrl} alt={extInfo.name} />}
                        <AvatarFallback className="text-sm font-bold bg-emerald-50 text-emerald-700">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-bold">Welcome back, {firstName} 👋</h1>
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                                {designationLabel}
                            </span>
                        </div>
                        <p className="text-muted-foreground">
                            View your profile, salary structure, and recent history
                        </p>
                    </div>
                </div>
            }
            content={
                <div className="space-y-7 pb-10">

                    {/* 2 ── Stat cards */}
                    <EmployeeStatCards
                        grossSalary={grossSalary}
                        latestBonus={latestBonus}
                        totalPaid={totalPaid}
                        pendingCount={pendingCount}
                        recordCount={salaries.length}
                    />

                    {/* 3 ── Info + Salary columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Employee personal information (3/5) */}
                        <EmployeeInfoCard
                            name={extInfo.name}
                            email={email}
                            address={extInfo.address}
                            phone={extInfo.phone}
                            whatsapp={extInfo.whatsapp}
                            bloodGroup={extInfo.bloodGroup}
                            nidNumber={extInfo.nidNumber}
                            dateOfBirth={extInfo.dateOfBirth}
                            tshirtSize={extInfo.tshirtSize}
                            designation={extInfo.designation}
                            nidPhotoFrontUrl={extInfo.nidPhotoFrontUrl}
                            nidPhotoBackUrl={extInfo.nidPhotoBackUrl}
                            onEditClick={() => setDialogOpen(true)}
                        />

                        {/* Salary structure + Payable stacked (2/5) */}
                        <div className="lg:col-span-2 space-y-5">
                            <SalaryStructureCard grossSalary={grossSalary} />
                            <PayableCard
                                grossSalary={grossSalary}
                                bonus={latestBonus}
                                isLoading={salaryLoading}
                            />
                        </div>
                    </div>

                    {/* 4 ── Salary history table */}
                    <SalaryHistoryTable salaries={salaries} />

                    {/* 5 ── Update info dialog */}
                    <UpdateInfoDialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        current={extInfo}
                        onSaved={() => {}}
                    />
                </div>
            }
        />
    );
};

export default EmployeePage;