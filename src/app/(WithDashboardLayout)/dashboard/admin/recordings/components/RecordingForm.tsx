import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { CourseResponse } from "@/redux/api/courseApi";
import type { BatchResponse } from "@/redux/api/batchApi";

export interface RecordingFormData {
  courseId: string;
  batchId: string;
  title: string;
  description: string;
  sessionDate: string;
  videoSource: "youtube" | "googledrive";
  videoId: string;
  duration: string;
  isPublished: boolean;
}

interface RecordingFormProps {
  formData: RecordingFormData;
  setFormData: Dispatch<SetStateAction<RecordingFormData>>;
  courses: CourseResponse[];
  batches: BatchResponse[];
  onSubmit: () => void;
  isLoading: boolean;
}

const RecordingForm = ({
  formData,
  setFormData,
  courses,
  batches,
  onSubmit,
  isLoading,
}: RecordingFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Course <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.courseId}
            onValueChange={(value) =>
              setFormData({ ...formData, courseId: value, batchId: "" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course._id} value={course._id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            Batch <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.batchId} onValueChange={(value) => setFormData({ ...formData, batchId: value })}>
            <SelectTrigger disabled={!formData.courseId}>
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch._id} value={batch._id}>
                  {batch.title} - {batch.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Week 1: Introduction to JavaScript"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the session content"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Session Date <span className="text-red-500">*</span>
          </Label>
          <Input
            type="date"
            value={formData.sessionDate}
            onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 90"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Video Source <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.videoSource}
          onValueChange={(value: "youtube" | "googledrive") =>
            setFormData({ ...formData, videoSource: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="googledrive">Google Drive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>
          Video ID <span className="text-red-500">*</span>
        </Label>
        <Input
          value={formData.videoId}
          onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
          placeholder={
            formData.videoSource === "youtube"
              ? "YouTube video ID (e.g., dQw4w9WgXcQ)"
              : "Google Drive file ID"
          }
        />
        <p className="text-xs text-muted-foreground">
          {formData.videoSource === "youtube"
            ? "YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID"
            : "Google Drive URL: https://drive.google.com/file/d/FILE_ID/view"}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished}
          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
          className="rounded border-gray-300"
        />
        <Label htmlFor="isPublished" className="cursor-pointer">
          Publish immediately (students can view)
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Saving..." : "Save Recording"}
        </Button>
      </div>
    </div>
  );
};

export default RecordingForm;
