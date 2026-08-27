"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw } from "lucide-react";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useGetDashboardMetadataQuery } from "@/redux/api/dashboardApi";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import ReportKeymetricsCards from "./components/ReportKeymetricsCards";
import dynamic from "next/dynamic";

const ReportCharts = dynamic(() => import("./components/ReportCharts"), { ssr: false });

type TimePeriod = '7days' | '30days' | '90days' | '1year';

interface DayWiseStat {
  date: string;
  totalIncome: number;
  totalEnrollment: number;
}

interface CourseWiseStat {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  totalIncome: number;
  totalEnrollments: number;
}

interface DashboardMetadata {
  totalEnrolled: number;
  totalIncome: number;
  dayWiseStats: DayWiseStat[];
  courseWiseStats: CourseWiseStat[];
  batchWiseIncome: {
    batchId: string;
    batchTitle: string;
    courseTitle: string;
    batchNumber: string;
    totalIncome: number;
    totalEnrollments: number;
  }[];
}

interface ProcessedData {
  totalIncome: number;
  totalEnrolled: number;
  activeCoursesCount: number;
  enrollmentData: { month: string; enrollments: number }[];
  revenueData: { month: string; revenue: number }[];
  coursePopularityData: { name: string; value: number; color: string }[];
  courseWiseStats: CourseWiseStat[];
  batchWiseIncome: DashboardMetadata["batchWiseIncome"];
}

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30days');
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const { data: metadata, isLoading: metadataLoading, error: metadataError, refetch: refetchMetadata } = useGetDashboardMetadataQuery(
    selectedCourseId === 'all' ? undefined : { courseId: selectedCourseId }
  );
  const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery({});

  const isLoading = metadataLoading || coursesLoading;
  const error = metadataError;

  const processedData = useMemo(() => {
    if (!metadata?.data) return null;

    const data = metadata.data as DashboardMetadata;

    const now = new Date();
    const periodDays: Record<TimePeriod, number> = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      '1year': 365
    };

    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - periodDays[selectedPeriod]);

    const filteredDayWiseStats = (data.dayWiseStats || []).filter((stat) => {
      const statDate = new Date(stat.date);
      return statDate >= cutoffDate;
    });

    const activeCourses = (coursesData?.data || []).filter((course) => course.status === 'published');
    const activeCoursesCount = selectedCourseId === 'all'
      ? activeCourses.length
      : activeCourses.filter((course) => course._id === selectedCourseId).length;

    const enrollmentData = filteredDayWiseStats.map((stat) => ({
      month: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      enrollments: stat.totalEnrollment,
    }));

    const revenueData = filteredDayWiseStats.map((stat) => ({
      month: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: stat.totalIncome,
    }));

    const coursePopularityData = (data.courseWiseStats || []).map((course, index) => ({
      name: course.courseTitle || `Course ${index + 1}`,
      value: course.totalEnrollments || 0,
      color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5],
    }));

    return {
      totalIncome: data.totalIncome || 0,
      totalEnrolled: data.totalEnrolled || 0,
      activeCoursesCount,
      enrollmentData,
      revenueData,
      coursePopularityData,
      courseWiseStats: data.courseWiseStats || [],
      batchWiseIncome: data.batchWiseIncome || [],
    } satisfies ProcessedData;
  }, [metadata, coursesData, selectedPeriod, selectedCourseId]);

  const selectedCourseTitle = useMemo(() => {
    if (selectedCourseId === 'all') return 'All Courses';
    const found = (coursesData?.data || []).find((course) => course._id === selectedCourseId);
    return found?.title || 'Selected Course';
  }, [coursesData, selectedCourseId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading reports data</p>
      </div>
    );
  }

  const handleExport = async () => {
    if (!processedData) return;

    setIsExporting(true);
    try {
      const meta = metadata.data as DashboardMetadata;

      const exportData = {
        period: selectedPeriod,
        course: selectedCourseTitle,
        generatedAt: new Date().toISOString(),
        summary: {
          totalRevenue: meta?.totalIncome || 0,
          totalEnrollments: meta?.totalEnrolled || 0,
          activeCourses: processedData?.activeCoursesCount || 0
        },
        courseWiseStats: processedData?.courseWiseStats || [],
        batchWiseIncome: processedData?.batchWiseIncome || [],
        dailyStats: processedData?.enrollmentData.map((item, index) => ({
          date: item.month,
          enrollments: item.enrollments,
          revenue: processedData.revenueData[index]?.revenue || 0
        })) || []
      };

      const csvContent = generateCSV(exportData);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `academy-reports-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSV = (data: {
    period: string;
    course: string;
    generatedAt: string;
    summary: { totalRevenue: number; totalEnrollments: number; activeCourses: number };
    courseWiseStats: CourseWiseStat[];
    batchWiseIncome: { batchTitle: string; totalEnrollments: number; totalIncome: number }[];
    dailyStats: { date: string; enrollments: number; revenue: number }[];
  }) => {
    let csv = 'Academy Reports\n';
    csv += `Period: ${data.period}\n`;
    csv += `Course: ${data.course}\n`;
    csv += `Generated: ${data.generatedAt}\n\n`;

    csv += 'Summary\n';
    csv += 'Metric,Value\n';
    csv += `Total Revenue,$${data.summary.totalRevenue}\n`;
    csv += `Total Enrollments,${data.summary.totalEnrollments}\n`;
    csv += `Active Courses,${data.summary.activeCourses}\n\n`;

    csv += 'Course-wise Statistics\n';
    csv += 'Course,Enrollments,Revenue\n';
    data.courseWiseStats.forEach((course) => {
      csv += `"${course.courseTitle}",${course.totalEnrollments},"$${course.totalIncome}"\n`;
    });
    csv += '\n';

    csv += 'Daily Statistics\n';
    csv += 'Date,Enrollments,Revenue\n';
    data.dailyStats.forEach((day) => {
      csv += `"${day.date}",${day.enrollments},"$${day.revenue}"\n`;
    });

    return csv;
  };

  return (

    <DashboardPageContainer
      heading="Reports & Analytics"
      subheading="Comprehensive insights into your academy&apos;s performance"
      buttons={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {(coursesData?.data || []).map((course) => (
                <SelectItem key={course._id} value={course._id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={(value: TimePeriod) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetchMetadata()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      }
      content={
        <>
          <ReportKeymetricsCards metadata={metadata as { data?: { totalIncome?: number; totalEnrolled?: number } }} processedData={processedData as { activeCoursesCount?: number } | undefined} coursesLoading={coursesLoading} />
          <ReportCharts data={processedData} />
        </>
      }
    />

  );
}
