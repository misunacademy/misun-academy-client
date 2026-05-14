import StudentProgressTracker from "@/components/module/dashboard/admin/student-progress-tracker/studentProgressTracker";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";


const StudentsProgressTrackerPage = () => {
    return (
        <DashboardPageContainer
            heading="Students Progress Tracker"
            subheading="Monitor and track the progress of students across various courses and modules."
            content={<StudentProgressTracker />}
        />
    );
};

export default StudentsProgressTrackerPage;