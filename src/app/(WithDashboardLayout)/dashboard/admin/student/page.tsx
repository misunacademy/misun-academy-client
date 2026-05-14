import DashboardPageContainer from '@/components/layout/DashboardPageContainer';
import EnrolledStudentTable from '@/components/module/dashboard/admin/student/EnrolledStudent';

const page = () => {
    return (
        <DashboardPageContainer
            heading="Student Management"
            subheading="Manage enrolled students and their information"
            content={<EnrolledStudentTable />} />

    );
};

export default page;