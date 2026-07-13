"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw } from "lucide-react";

// import { useGetMetadataQuery } from "@/redux/api/studentApi";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useGetDashboardMetadataQuery } from "@/redux/api/dashboardApi";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import ReportKeymetricsCards from "./components/ReportKeymetricsCards";
import dynamic from "next/dynamic";

const ReportCharts = dynamic(() => import("./components/ReportCharts"), { ssr: false });

type TimePeriod = '7days' | '30days' | '90days' | '1year';

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

  // Calculate dynamic data - moved before early returns
  const processedData = useMemo(() => {
    if (!metadata?.data) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = metadata.data as any;

    // Filter data based on selected period
    const now = new Date();
    const periodDays = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      '1year': 365
    };

    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - periodDays[selectedPeriod]);

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const filteredDayWiseStats = (data.dayWiseStats || []).filter((stat: any) => {
      const statDate = new Date(stat.date);
      return statDate >= cutoffDate;
    });


    // Get active courses count (for selected course, this becomes either 1 or 0)
    const activeCourses = coursesData?.data?.filter((course: any) => (course.status || '').toLowerCase() === 'published') || [];
    const activeCoursesCount = selectedCourseId === 'all'
      ? activeCourses.length
      : activeCourses.filter((course: any) => course._id === selectedCourseId).length;

    // Format data for charts
    const enrollmentData = filteredDayWiseStats.map((stat: any) => ({
      month: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      enrollments: stat.totalEnrollment,
    }));

    const revenueData = filteredDayWiseStats.map((stat: any) => ({
      month: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: stat.totalIncome,
    }));

    // For course popularity, use course-wise stats
    const coursePopularityData = (data.courseWiseStats || []).map((course: any, index: number) => ({
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
      batchWiseIncome: data.batchWiseIncome || []
    };
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }, [metadata, coursesData, selectedPeriod, selectedCourseId]);

  const selectedCourseTitle = useMemo(() => {
    if (selectedCourseId === 'all') return 'All Courses';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const found = (coursesData?.data || []).find((course: any) => course._id === selectedCourseId);
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
      // Create export data
      const exportData = {
        period: selectedPeriod,
        course: selectedCourseTitle,
        generatedAt: new Date().toISOString(),
        summary: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          totalRevenue: (metadata?.data as any)?.totalIncome || 0,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          totalEnrollments: (metadata?.data as any)?.totalEnrolled || 0,
          activeCourses: processedData?.activeCoursesCount || 0
        },
        courseWiseStats: processedData?.courseWiseStats || [],
        batchWiseIncome: processedData?.batchWiseIncome || [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dailyStats: processedData?.enrollmentData.map((item: any, index: number) => ({
          date: item.month,
          enrollments: item.enrollments,
          revenue: processedData.revenueData[index]?.revenue || 0
        })) || []
      };

      // Convert to CSV
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
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateCSV = (data: any) => {
    let csv = 'Academy Reports\n';
    csv += `Period: ${data.period}\n`;
    csv += `Course: ${data.course}\n`;
    csv += `Generated: ${data.generatedAt}\n\n`;

    // Summary
    csv += 'Summary\n';
    csv += 'Metric,Value\n';
    csv += `Total Revenue,$${data.summary.totalRevenue}\n`;
    csv += `Total Enrollments,${data.summary.totalEnrollments}\n`;
    csv += `Active Courses,${data.summary.activeCourses}\n\n`;

    // Course-wise stats
    csv += 'Course-wise Statistics\n';
    csv += 'Course,Enrollments,Revenue\n';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.courseWiseStats.forEach((course: any) => {
      csv += `"${course.courseTitle}",${course.totalEnrollments},"$${course.totalIncome}"\n`;
    });
    csv += '\n';

    // Daily stats
    csv += 'Daily Statistics\n';
    csv += 'Date,Enrollments,Revenue\n';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.dailyStats.forEach((day: any) => {
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
          {/* Key Metrics */}
          <ReportKeymetricsCards metadata={metadata} processedData={processedData} coursesLoading={coursesLoading} />
          {/* Charts */}
          <ReportCharts data={processedData} />
        </>
      }
    />



  );
}