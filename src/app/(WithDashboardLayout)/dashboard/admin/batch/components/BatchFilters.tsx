import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CourseResponse } from "@/redux/api/courseApi";

interface BatchFiltersProps {
  courses: CourseResponse[];
  courseFilter: string;
  statusFilter: string;
  statusOptions: Array<{ value: string; label: string }>;
  onCourseChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const BatchFilters = ({
  courses,
  courseFilter,
  statusFilter,
  statusOptions,
  onCourseChange,
  onStatusChange,
}: BatchFiltersProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4 justify-end">
        <Select value={courseFilter} onValueChange={onCourseChange}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course._id} value={course._id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default BatchFilters;
