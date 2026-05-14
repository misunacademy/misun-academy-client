import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import BatchEdit from "@/components/module/dashboard/admin/batch/Edit";


const page = () => {
    return (
        <DashboardPageContainer
            heading="Batch Management"
            subheading="Create and manage course batches"
            content={<BatchEdit />} />

    );
};

export default page;
