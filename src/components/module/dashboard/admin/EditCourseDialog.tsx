import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clock, Calendar as CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { Course, Duration } from "@/types/common";

const formatDuration = (duration: Duration | string | undefined): string => {
  if (!duration) return '';
  if (typeof duration === 'string') return duration;
  if (duration.weeks) return `${duration.weeks} weeks`;
  if (duration.hours) return `${duration.hours} hours`;
  return '';
};

type DateField = 'enrollmentStartDate' | 'enrollmentEndDate' | 'courseStartDate' | 'courseEndDate' | 'enrollmentDeadline';

interface EditCourseDialogProps {
  editingCourse: Course | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onDateChange: (field: DateField, date: Date | undefined) => void;
  onFieldChange: (field: keyof Course, value: any) => void;
  isAddingNew?: boolean;
}

export function EditCourseDialog({
  editingCourse,
  isOpen,
  onOpenChange,
  onSave,
  onDateChange,
  onFieldChange,
  isAddingNew = false
}: EditCourseDialogProps) {
  if (!editingCourse) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isAddingNew ? "Add New Course" : `Edit Course - ${editingCourse?.title}`}
          </DialogTitle>
          <DialogDescription>
            {isAddingNew 
              ? "Create a new course with enrollment dates and scheduling information."
              : "Update course details, enrollment dates, and scheduling information."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={editingCourse.title}
                onChange={(e) => onFieldChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={editingCourse.subtitle || ''}
                onChange={(e) => onFieldChange('subtitle', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editingCourse.description || ''}
              onChange={(e) => onFieldChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              value={editingCourse.shortDescription || ''}
              onChange={(e) => onFieldChange('shortDescription', e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                value={typeof editingCourse.instructor === 'string' ? editingCourse.instructor : editingCourse.instructor?.name || ''}
                onChange={(e) => onFieldChange('instructor', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseCode">Course Code</Label>
              <Input
                id="courseCode"
                value={editingCourse.courseCode || ''}
                onChange={(e) => onFieldChange('courseCode', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={editingCourse.category || ''}
                onChange={(e) => onFieldChange('category', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input
                id="subcategory"
                value={editingCourse.subcategory || ''}
                onChange={(e) => onFieldChange('subcategory', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={editingCourse.level || 'Beginner'}
                onValueChange={(value: string) => onFieldChange('level', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={editingCourse.language || 'English'}
                onChange={(e) => onFieldChange('language', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isFeatured">Featured</Label>
              <input
                id="isFeatured"
                type="checkbox"
                checked={editingCourse.isFeatured || false}
                onChange={(e) => onFieldChange('isFeatured', e.target.checked)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input
                id="thumbnailUrl"
                value={editingCourse.thumbnailUrl || ''}
                onChange={(e) => onFieldChange('thumbnailUrl', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverImageUrl">Cover Image URL</Label>
              <Input
                id="coverImageUrl"
                value={editingCourse.coverImageUrl || ''}
                onChange={(e) => onFieldChange('coverImageUrl', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={editingCourse.tags?.join(', ') || ''}
              onChange={(e) => onFieldChange('tags', e.target.value.split(',').map(s => s.trim()))}
            />
          </div>
              <Input
                id="duration"
                value={formatDuration(editingCourse.duration)}
                onChange={(e) => onFieldChange('duration', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editingCourse.status || 'draft'}
                onValueChange={(value: string) => onFieldChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={editingCourse.category || ''}
                onChange={(e) => onFieldChange('category', e.target.value)}
              />
            </div>
          {/* </div> */}

          {/* Enrollment Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Enrollment Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enrollmentCapacity">Capacity</Label>
                <Input
                  id="enrollmentCapacity"
                  type="number"
                  value={editingCourse.enrollment?.capacity || 0}
                  onChange={(e) => onFieldChange('enrollment', { ...editingCourse.enrollment, capacity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollmentStatus">Enrollment Status</Label>
                <Select
                  value={editingCourse.enrollment?.status || 'open'}
                  onValueChange={(value: string) => onFieldChange('enrollment', { ...editingCourse.enrollment, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="waitlist">Waitlist</SelectItem>
                    <SelectItem value="coming_soon">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Enrollment Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Enrollment Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingCourse.enrollmentStartDate ? format(editingCourse.enrollmentStartDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editingCourse.enrollmentStartDate}
                      onSelect={(date) => onDateChange('enrollmentStartDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Enrollment End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingCourse.enrollmentEndDate ? format(editingCourse.enrollmentEndDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editingCourse.enrollmentEndDate}
                      onSelect={(date) => onDateChange('enrollmentEndDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Enrollment Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editingCourse.enrollmentDeadline ? format(editingCourse.enrollmentDeadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editingCourse.enrollmentDeadline}
                    onSelect={(date) => onDateChange('enrollmentDeadline', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          {/* </div> */}

          {/* Course Dates */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Course Schedule
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingCourse.courseStartDate ? format(editingCourse.courseStartDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editingCourse.courseStartDate}
                      onSelect={(date) => onDateChange('courseStartDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Course End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingCourse.courseEndDate ? format(editingCourse.courseEndDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editingCourse.courseEndDate}
                      onSelect={(date) => onDateChange('courseEndDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">Class Schedule</Label>
              <Textarea
                id="schedule"
                value={editingCourse.schedule || ''}
                onChange={(e) => onFieldChange('schedule', e.target.value)}
                placeholder="e.g., Mon, Wed, Fri - 7:00 PM - 9:00 PM"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {isAddingNew ? "Create Course" : "Save Changes"}
            </Button>
          </div>
        {/* </div> */}
      </DialogContent>
    </Dialog>
  );
}