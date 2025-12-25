import EnrolledStudentTable from '@/components/module/dashboard/student/EnrolledStudent';
import React from 'react';

const page = () => {
    return (
        <div>
            {/* student table with filtering, pagination, searching, sorting functionality, etc */}
            {/* <Students /> */}
            <EnrolledStudentTable />
        </div>
    );
};

export default page;