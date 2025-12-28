/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Course } from "@/types/common";

interface CoursesTableProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onDeleteCourse?: (courseId: string | number | undefined) => void;
}

export function CoursesTable({ courses, onEditCourse, onDeleteCourse }: CoursesTableProps) {
  console.log("courses",courses);
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Courses</CardTitle>
        <CardDescription>View and manage all courses in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-9" />
          </div>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Title</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Enrollment Period</TableHead>
              <TableHead>Course Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course: Course) => (
              <TableRow key={String(course._id)}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>{typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || '—'}</TableCell>
                <TableCell>{course.studentsCount ?? 0}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>Start: {course.enrollmentStartDate ? format(new Date(course.enrollmentStartDate), 'MMM dd') : '—'}</div>
                    <div>End: {course.enrollmentEndDate ? format(new Date(course.enrollmentEndDate), 'MMM dd') : '—'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>Start: {course.courseStartDate ? format(new Date(course.courseStartDate), 'MMM dd, yyyy') : '—'}</div>
                    <div>End: {course.courseEndDate ? format(new Date(course.courseEndDate), 'MMM dd, yyyy') : '—'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={course.isPublished === true ? 'default' : 'secondary'}>
                    {course.isPublished === true ? 'Active' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEditCourse(course)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteCourse && onDeleteCourse(course?._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}