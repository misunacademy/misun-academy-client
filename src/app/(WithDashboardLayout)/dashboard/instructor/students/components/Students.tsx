/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { GraduationCap } from "lucide-react";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import DashboardPageTableWithPagination from "@/components/layout/DashboardPageTableWithPagination";
import StudentsFiltersCard from "./StudentsFiltersCard";
import StudentsStatsCards from "./StudentsStatsCards";
import StudentsTableRow, { StudentRow } from "./StudentsTableRow";
import {
    useGetInstructorCoursesQuery,
    useGetInstructorEnrolledStudentsQuery,
    type InstructorCourse,
} from "@/redux/api/instructorApi";

const PAGE_SIZE = 10;

export default function StudentsPage() {
    const { data: coursesData, isLoading: coursesLoading } = useGetInstructorCoursesQuery();
    const courses: InstructorCourse[] = useMemo(() => coursesData?.data || [], [coursesData?.data]);

    const [selectedBatchId, setSelectedBatchId] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const courseBatches = useMemo(() => {
        return courses.flatMap((course) =>
            (course.batches || []).map((batch) => ({
                ...batch,
                courseTitle: course.title,
            }))
        );
    }, [courses]);

    const statusParam = statusFilter === "all" ? undefined : statusFilter.toLowerCase();

    const { data: studentsDataResponse, isLoading: studentsLoading } = useGetInstructorEnrolledStudentsQuery({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: statusParam,
        batchId: selectedBatchId !== "all" ? selectedBatchId : undefined,
    });

    const studentsData = useMemo(() => studentsDataResponse?.data || [], [studentsDataResponse?.data]);
    const metaData = studentsDataResponse?.meta;
    const totalStudentsData = metaData?.total || 0;
    const totalPages = metaData?.totalPages || 1;

    const allStudents: StudentRow[] = useMemo(() => {
        return studentsData.map((enrollment: any, index: number) => ({
            _id: enrollment._id || enrollment.userId?._id || enrollment.enrollmentId || `row-${index}`,
            enrollmentId: enrollment.enrollmentId,
            name: enrollment.userId?.name || "Unknown",
            email: enrollment.userId?.email || "-",
            phone: enrollment.userId?.phone || "-",
            image: enrollment.userId?.image,
            status: enrollment.status || "-",
            enrolledAt: enrollment.enrolledAt || enrollment.createdAt || "",
            batchTitle: enrollment.batchTitle || "-",
            courseTitle: enrollment.courseTitle || "-",
        }));
    }, [studentsData]);

    const totalStudentsStats = courses.reduce(
        (sum, course) => sum + (course.batches || []).reduce((sub, batch) => sub + (batch.currentEnrollment || 0), 0),
        0
    );
    const totalBatches = courses.reduce((sum, course) => sum + (course.batches || []).length, 0);

    const pagination = totalStudentsData > 0
        ? { page, totalPages, total: totalStudentsData, limit: PAGE_SIZE, onPageChange: setPage }
        : undefined;

    return (
        <DashboardPageContainer
            heading="Student Management"
            subheading="View students enrolled in your courses"
            buttons={<GraduationCap className="w-7 h-7 text-primary" />}
            content={
                <div className="space-y-6">
                    {!coursesLoading && (
                        <StudentsStatsCards totalBatches={totalBatches} totalStudents={totalStudentsStats} />
                    )}

                    <DashboardPageTableWithPagination
                        heading="Enrolled Students"
                        subheading="Students across your assigned courses and batches"
                        filters={
                            <StudentsFiltersCard
                                search={search}
                                batchId={selectedBatchId}
                                statusFilter={statusFilter}
                                batches={courseBatches}
                                onSearchChange={setSearch}
                                onBatchChange={(value) => {
                                    setSelectedBatchId(value);
                                    setPage(1);
                                }}
                                onStatusChange={(value) => {
                                    setStatusFilter(value);
                                    setPage(1);
                                }}
                            />
                        }
                        columns={[
                            "Student",
                            "Enrollment ID",
                            "Email",
                            "Phone",
                            "Course",
                            "Batch",
                            "Status",
                            "Enrolled Date",
                        ]}
                        data={allStudents}
                        renderRow={(student) => <StudentsTableRow student={student} />}
                        getRowKey={(student) => student._id}
                        isLoading={studentsLoading}
                        emptyState="No students found."
                        pagination={pagination}
                    />
                </div>
            }
        />
    );
}
