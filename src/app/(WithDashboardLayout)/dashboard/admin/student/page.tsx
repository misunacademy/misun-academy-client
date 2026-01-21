import EnrolledStudentTable from '@/components/module/dashboard/student/EnrolledStudent';
import React from 'react';

const page = () => {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Student Management</h1>
                    <p className="text-muted-foreground">Manage enrolled students and their information</p>
                </div>
            </div>

            <EnrolledStudentTable />
        </div>
    );
};

export default page;