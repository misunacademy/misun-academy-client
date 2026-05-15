/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, RefreshCw } from "lucide-react";

// import { useGetMetadataQuery } from "@/redux/api/studentApi";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useGetDashboardMetadataQuery } from "@/redux/api/dashboardApi";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import ReportKeymetricsCards from "./components/ReportKeymetricsCards";
import DashboardPageTabs from "@/components/layout/DashboardPageTabs";

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

    const data = metadata.data;

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
  }, [metadata, coursesData, selectedPeriod, selectedCourseId]);

  const selectedCourseTitle = useMemo(() => {
    if (selectedCourseId === 'all') return 'All Courses';
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
          totalRevenue: metadata?.data?.totalIncome || 0,
          totalEnrollments: metadata?.data?.totalEnrolled || 0,
          activeCourses: processedData?.activeCoursesCount || 0
        },
        courseWiseStats: processedData?.courseWiseStats || [],
        batchWiseIncome: processedData?.batchWiseIncome || [],
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
    data.courseWiseStats.forEach((course: any) => {
      csv += `"${course.courseTitle}",${course.totalEnrollments},"$${course.totalIncome}"\n`;
    });
    csv += '\n';

    // Daily stats
    csv += 'Daily Statistics\n';
    csv += 'Date,Enrollments,Revenue\n';
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
              {(coursesData?.data || []).map((course: any) => (
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
          <DashboardPageTabs
            defaultValue="enrollment"
            triggers={[
              { value: "enrollment", label: "Enrollment Trends" },
              { value: "revenue", label: "Revenue Analytics" },
              { value: "courses", label: "Course Popularity" },
            ]}
            contents={[
              {
                value: "enrollment",
                content: (
                  <Card>
                    <CardHeader>
                      <CardTitle>Enrollment Trends</CardTitle>
                      <CardDescription>Student enrollment patterns over the selected period</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={processedData?.enrollmentData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="enrollments" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                ),
              },
              {
                value: "revenue",
                content: (
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Analytics</CardTitle>
                      <CardDescription>Revenue breakdown and trends for the selected period</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={processedData?.revenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                          <Bar dataKey="revenue" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                ),
              },
              {
                value: "courses",
                content: (
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Popularity Distribution</CardTitle>
                      <CardDescription>Most popular courses by enrollment numbers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={processedData?.coursePopularityData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name} (${value})`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {processedData?.coursePopularityData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                ),
              },
            ]}
          />
        </>
      }
    />



  );
}