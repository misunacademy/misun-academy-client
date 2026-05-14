import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import BatchCrate from "@/components/module/dashboard/admin/batch/Create";


const page = () => {
    return (
        <DashboardPageContainer
            heading="Batch Management"
            subheading="Create and manage course batches"
            content={<BatchCrate />} />

    );
};

export default page;
