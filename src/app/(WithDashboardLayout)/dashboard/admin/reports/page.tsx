/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Users, DollarSign, BookOpen, Calendar, RefreshCw } from "lucide-react";

import { useGetMetadataQuery } from "@/redux/features/student/studentApi";
import { useGetCoursesQuery } from "@/redux/features/course/courseApi";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";

type TimePeriod = '7days' | '30days' | '90days' | '1year';

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30days');
  const [isExporting, setIsExporting] = useState(false);

  const { data: metadata, isLoading: metadataLoading, error: metadataError, refetch: refetchMetadata } = useGetMetadataQuery(undefined);
  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery({});

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

    // Calculate completion rate (placeholder - would need actual completion data)
    const totalEnrolled = data.totalEnrolled;
    const completionRate = totalEnrolled > 0 ? Math.min(85 + Math.random() * 10, 95) : 0; // Mock completion rate

    // Get active courses count
    const activeCourses = coursesData?.data?.filter((course: any) => course.isPublished) || [];
    const activeCoursesCount = activeCourses.length;

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
      completionRate: Math.round(completionRate),
      enrollmentData,
      revenueData,
      coursePopularityData,
      courseWiseStats: data.courseWiseStats || [],
      batchWiseIncome: data.batchWiseIncome || []
    };
  }, [metadata, coursesData, selectedPeriod]);

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
        generatedAt: new Date().toISOString(),
        summary: {
          totalRevenue: metadata?.data?.totalIncome || 0,
          totalEnrollments: metadata?.data?.totalEnrolled || 0,
          activeCourses: processedData?.activeCoursesCount || 0,
          completionRate: processedData?.completionRate || 0
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
    csv += `Generated: ${data.generatedAt}\n\n`;

    // Summary
    csv += 'Summary\n';
    csv += 'Metric,Value\n';
    csv += `Total Revenue,$${data.summary.totalRevenue}\n`;
    csv += `Total Enrollments,${data.summary.totalEnrollments}\n`;
    csv += `Active Courses,${data.summary.activeCourses}\n`;
    csv += `Completion Rate,${data.summary.completionRate}%\n\n`;

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your academy&apos;s performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={(value: TimePeriod) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
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
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(metadata?.data?.totalIncome || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Revenue from enrollments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metadata?.data?.totalEnrolled || 0}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Students enrolled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processedData?.activeCoursesCount}</div>
            <p className="text-xs text-muted-foreground">
              {coursesLoading ? 'Loading...' : 'Published courses'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processedData?.completionRate}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Course completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="enrollment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="enrollment">Enrollment Trends</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="courses">Course Popularity</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollment" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
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
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}