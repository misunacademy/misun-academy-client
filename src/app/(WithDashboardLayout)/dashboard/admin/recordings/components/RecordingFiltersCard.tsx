import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CourseResponse } from "@/redux/api/courseApi";
import type { BatchResponse } from "@/redux/api/batchApi";

export interface RecordingFilters {
  courseId?: string;
  batchId?: string;
  isPublished?: boolean;
}

interface RecordingFiltersCardProps {
  filters: RecordingFilters;
  courses: CourseResponse[];
  batches: BatchResponse[];
  onFiltersChange: (filters: RecordingFilters) => void;
  onPageReset: () => void;
  getBatchCourseTitle: (batch: BatchResponse) => string | undefined;
}

const RecordingFiltersCard = ({
  filters,
  courses,
  batches,
  onFiltersChange,
  onPageReset,
  getBatchCourseTitle,
}: RecordingFiltersCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4 justify-end items-center">
        <Select
          value={filters.courseId || "all"}
          onValueChange={(value) => {
            const nextCourseId = value === "all" ? undefined : value;
            onFiltersChange({ ...filters, courseId: nextCourseId, batchId: undefined });
            onPageReset();
          }}
        >
          <SelectTrigger className="w-[200px]">
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

        <Select
          value={filters.batchId || "all"}
          onValueChange={(value) => {
            onFiltersChange({ ...filters, batchId: value === "all" ? undefined : value });
            onPageReset();
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Batches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {batches.map((batch) => (
              <SelectItem key={batch._id} value={batch._id}>
                {getBatchCourseTitle(batch) || "Unknown Course"} - <strong>{batch.title}</strong> - {batch.status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={
            filters.isPublished === undefined
              ? "all"
              : filters.isPublished
                ? "published"
                : "unpublished"
          }
          onValueChange={(value) => {
            onFiltersChange({
              ...filters,
              isPublished: value === "all" ? undefined : value === "published",
            });
            onPageReset();
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="unpublished">Unpublished</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default RecordingFiltersCard;
