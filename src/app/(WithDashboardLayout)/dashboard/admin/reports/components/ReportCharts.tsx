"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import DashboardPageTabs from "@/components/layout/DashboardPageTabs";

interface ChartData {
  enrollmentData: { month: string; enrollments: number }[];
  revenueData: { month: string; revenue: number }[];
  coursePopularityData: { name: string; value: number; color: string }[];
}

export default function ReportCharts({ data }: { data: ChartData | null }) {
  return (
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
                  <LineChart data={data?.enrollmentData}>
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
                  <BarChart data={data?.revenueData}>
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
                      data={data?.coursePopularityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} (${value})`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data?.coursePopularityData.map((entry, index) => (
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
  );
}
