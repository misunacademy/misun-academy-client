"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BatchResponse } from "@/redux/api/batchApi";
interface Course { _id: string; title: string }

interface ProgressFiltersProps {
  search: string;
  courseIdFilter: string;
  batchIdFilter: string;
  statusFilter: string;
  courses: Course[];
  batches: BatchResponse[];
  onSearchChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onBatchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  getBatchCourseTitle: (batch: BatchResponse) => string;
}

export function ProgressFilters({
  search, courseIdFilter, batchIdFilter, statusFilter,
  courses, batches, onSearchChange, onCourseChange, onBatchChange, onStatusChange,
  getBatchCourseTitle,
}: ProgressFiltersProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
      <CardContent className="flex justify-between items-center gap-4">
        <div className="flex-1 flex items-center">
          <Input className="max-w-sm" placeholder="Search by name, email or ID" value={search}
            onChange={(event) => onSearchChange(event.target.value)} />
        </div>
        <div className="flex items-center gap-3 flex-1">
          <Select value={courseIdFilter} onValueChange={onCourseChange}>
            <SelectTrigger><SelectValue placeholder="Filter by course" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course._id} value={course._id}>{course.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={batchIdFilter} onValueChange={onBatchChange}>
            <SelectTrigger><SelectValue placeholder="Filter by batch" /></SelectTrigger>
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
            <SelectTrigger><SelectValue placeholder="Enrollment status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="payment-pending">Payment Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="payment-failed">Payment Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
