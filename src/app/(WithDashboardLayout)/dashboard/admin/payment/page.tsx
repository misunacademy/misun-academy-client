import DashboardPageContainer from '@/components/layout/DashboardPageContainer';
import PaymentTable from '@/app/(WithDashboardLayout)/dashboard/admin/payment/components/PaymentTable';

const page = () => {
    return (
        <DashboardPageContainer
            heading="Payment Management"
            subheading="Monitor and manage all payment transactions"
            content={<PaymentTable />} />

    );
};

export default page;