"use client";

import { useEffect, useMemo, useState } from "react";
import { GraduationCap } from "lucide-react";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import { DataTable } from "@/components/ui/data-table";
import StudentsFiltersCard from "./StudentsFiltersCard";
import StudentsStatsCards from "./StudentsStatsCards";
import { useStudentColumns, type StudentRow } from "./studentColumns";
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
    const metaData = studentsDataResponse?.meta as { total?: number; totalPages?: number } | undefined;
    const totalStudentsData = metaData?.total || 0;
    const totalPages = metaData?.totalPages || 1;

    const allStudents: StudentRow[] = useMemo(() => {
        interface EnrolledStudentRaw {
          _id?: string; enrollmentId?: string; status?: string; enrolledAt?: string; createdAt?: string;
          batchTitle?: string; courseTitle?: string;
          userId?: { _id?: string; name?: string; email?: string; phone?: string; image?: string };
        }
        return studentsData.map((enrollment: unknown, index: number) => {
          const e = enrollment as EnrolledStudentRaw;
          return {
            _id: e._id || e.userId?._id || e.enrollmentId || `row-${index}`,
            enrollmentId: e.enrollmentId,
            name: e.userId?.name || "Unknown",
            email: e.userId?.email || "-",
            phone: e.userId?.phone || "-",
            image: e.userId?.image,
            status: e.status || "-",
            enrolledAt: e.enrolledAt || e.createdAt || "",
            batchTitle: e.batchTitle || "-",
            courseTitle: e.courseTitle || "-",
          };
        });
    }, [studentsData]);

    const totalStudentsStats = courses.reduce(
        (sum, course) => sum + (course.batches || []).reduce((sub, batch) => sub + (batch.currentEnrollment || 0), 0),
        0
    );
    const totalBatches = courses.reduce((sum, course) => sum + (course.batches || []).length, 0);

    const columns = useStudentColumns();

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

                    <DataTable
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
                        columns={columns}
                        data={allStudents}
                        getRowId={(student) => student._id}
                        isLoading={studentsLoading}
                        emptyState="No students found."
                        pagination={pagination}
                    />
                </div>
            }
        />
    );
}
