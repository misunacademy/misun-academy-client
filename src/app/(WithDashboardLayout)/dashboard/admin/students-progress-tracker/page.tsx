import StudentProgressTracker from "@/components/module/dashboard/student-progress-tracker/studentProgressTracker";


const StudentsProgressTrackerPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Students Progress Tracker</h1>
            <p className="text-gray-600 mb-6">Monitor and track the progress of students across various courses and modules.</p>
            <StudentProgressTracker />
        </div>
    );
};

export default StudentsProgressTrackerPage;