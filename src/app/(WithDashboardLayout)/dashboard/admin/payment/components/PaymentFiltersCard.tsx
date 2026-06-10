import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CourseResponse } from "@/redux/api/courseApi";
import type { BatchResponse } from "@/redux/api/batchApi";

interface PaymentFiltersCardProps {
  courses: CourseResponse[];
  batches: BatchResponse[];
  selectedCourseId: string;
  selectedBatchId: string;
  statusFilter: string;
  search: string;
  onSearchChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onBatchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const PaymentFiltersCard = ({
  courses,
  batches,
  selectedCourseId,
  selectedBatchId,
  statusFilter,
  search,
  onSearchChange,
  onCourseChange,
  onBatchChange,
  onStatusChange,
}: PaymentFiltersCardProps) => {
  const getBatchCourseTitle = (batch: BatchResponse) => {
    if (!batch.courseId) return "";
    if (typeof batch.courseId === "string") {
      return courses.find((course) => course._id === batch.courseId)?.title || "";
    }
    return batch.courseId.title;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search payments..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:max-w-sm"
          aria-label="Search payments"
        />
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Select value={selectedCourseId} onValueChange={onCourseChange}>
            <SelectTrigger className="w-full sm:w-[220px]">
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

          <Select value={selectedBatchId} onValueChange={onBatchChange}>
            <SelectTrigger className="w-full sm:w-[230px]">
              <SelectValue placeholder="Filter by batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {batches.map((batch) => (
                <SelectItem key={batch._id} value={batch._id}>
                  {getBatchCourseTitle(batch)} - <strong>{batch.title}</strong> - {batch.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentFiltersCard;
