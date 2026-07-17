"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";

const BATCH_STATUSES = [
  { value: "draft", label: "Draft", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  { value: "upcoming", label: "Upcoming", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  { value: "running", label: "Running", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  { value: "completed", label: "Completed", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
];

interface Course { _id: string; title: string }
interface FormData { title: string; price: string; status: string; selectedCourse: string; startDate: string; endDate: string; enrollmentStartDate: string; enrollmentEndDate: string; description: string }

interface BatchFormProps {
  editingBatchId: string | null;
  formData: FormData;
  courses: Course[];
  coursesLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: FormEvent) => Promise<void>;
  onReset: () => void;
}

export function BatchForm({ editingBatchId, formData, courses, coursesLoading, isCreating, isUpdating, onInputChange, onSubmit, onReset }: BatchFormProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{editingBatchId ? "Edit Batch" : "Create New Batch"}</CardTitle>
            <CardDescription>{editingBatchId ? "Update batch information" : "Add a new batch with all required details"}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onReset}><X className="w-4 h-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="course">Course *</Label>
            <Select value={formData.selectedCourse} onValueChange={(val) => onInputChange("selectedCourse", val)} required>
              <SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger>
              <SelectContent>
                {coursesLoading ? (
                  <div className="flex items-center justify-center py-2"><Loader2 className="w-4 h-4 animate-spin" /></div>
                ) : courses.length > 0 ? (
                  courses.map((course) => (<SelectItem key={course._id} value={course._id}>{course.title}</SelectItem>))
                ) : (<SelectItem value="no-courses" disabled>No courses available</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Batch Title *</Label>
              <Input id="title" value={formData.title} onChange={(e) => onInputChange("title", e.target.value)} placeholder="e.g. Batch 6 - Winter 2026" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (BDT) *</Label>
              <Input id="price" type="number" value={formData.price} onChange={(e) => onInputChange("price", e.target.value)} placeholder="4000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(val) => onInputChange("status", val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BATCH_STATUSES.map((status) => (<SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => onInputChange("description", e.target.value)} placeholder="Brief description of this batch" rows={3} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Batch Start Date *</Label>
              <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => onInputChange("startDate", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Batch End Date *</Label>
              <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => onInputChange("endDate", e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enrollmentStartDate">Enrollment Start *</Label>
              <Input id="enrollmentStartDate" type="date" value={formData.enrollmentStartDate} onChange={(e) => onInputChange("enrollmentStartDate", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollmentEndDate">Enrollment End *</Label>
              <Input id="enrollmentEndDate" type="date" value={formData.enrollmentEndDate} onChange={(e) => onInputChange("enrollmentEndDate", e.target.value)} required />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingBatchId ? "Update Batch" : "Create Batch"}
            </Button>
            {editingBatchId && (<Button type="button" variant="outline" onClick={onReset}>Cancel</Button>)}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
