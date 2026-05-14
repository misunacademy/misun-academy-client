import DashboardPageContainer from '@/components/layout/DashboardPageContainer';
import PaymentTable from '@/components/module/dashboard/admin/payment/PaymentTable';

const page = () => {
    return (
        <DashboardPageContainer
            heading="Payment Management"
            subheading="Monitor and manage all payment transactions"
            content={<PaymentTable />} />

    );
};

export default page;