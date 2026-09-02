import Dashboard from '@/app/(WithDashboardLayout)/dashboard/admin/_components/Dashboard';

export const instant = false

const page = () => {
    return (
        <div className="space-y-6">
            <Dashboard />
        </div>
    );
};

export default page;
