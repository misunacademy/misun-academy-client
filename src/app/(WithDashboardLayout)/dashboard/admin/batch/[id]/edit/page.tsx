import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import BatchEdit from "@/app/(WithDashboardLayout)/dashboard/admin/batch/components/Edit";


const page = () => {
    return (
        <DashboardPageContainer
            heading="Batch Management"
            subheading="Create and manage course batches"
            content={<BatchEdit />} />

    );
};

export default page;
