import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import BatchCrate from "@/app/(WithDashboardLayout)/dashboard/admin/batch/components/Create";


const page = () => {
    return (
        <DashboardPageContainer
            heading="Batch Management"
            subheading="Create and manage course batches"
            content={<BatchCrate />} />

    );
};

export default page;
