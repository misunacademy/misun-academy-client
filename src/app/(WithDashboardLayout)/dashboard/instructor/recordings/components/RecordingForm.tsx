import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { InstructorCourse } from "@/redux/api/instructorApi";

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

export const EMPTY_RECORDING_FORM: RecordingFormData = {
  courseId: "",
  batchId: "",
  title: "",
  description: "",
  sessionDate: "",
  videoSource: "youtube",
  videoId: "",
  duration: "",
  isPublished: false,
};

interface RecordingFormProps {
  formData: RecordingFormData;
  setFormData: Dispatch<SetStateAction<RecordingFormData>>;
  courses: InstructorCourse[];
  onSubmit: () => void;
  isLoading: boolean;
}

const RecordingForm = ({ formData, setFormData, courses, onSubmit, isLoading }: RecordingFormProps) => {
  const selectedCourse = courses.find((course) => course._id === formData.courseId);
  const batches = selectedCourse?.batches || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Course <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.courseId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, courseId: value, batchId: "" }))}
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
          <Select
            value={formData.batchId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, batchId: value }))}
            disabled={!formData.courseId}
          >
            <SelectTrigger>
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
          onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="e.g., Week 1: Introduction to the course"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
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
            onChange={(event) => setFormData((prev) => ({ ...prev, sessionDate: event.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            value={formData.duration}
            onChange={(event) => setFormData((prev) => ({ ...prev, duration: event.target.value }))}
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
            setFormData((prev) => ({ ...prev, videoSource: value }))
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
          onChange={(event) => setFormData((prev) => ({ ...prev, videoId: event.target.value }))}
          placeholder={
            formData.videoSource === "youtube"
              ? "YouTube video ID (e.g., dQw4w9WgXcQ)"
              : "Google Drive file ID"
          }
        />
        <p className="text-xs text-muted-foreground">
          {formData.videoSource === "youtube"
            ? "Extract from: https://www.youtube.com/watch?v=VIDEO_ID"
            : "Extract from: https://drive.google.com/file/d/FILE_ID/view"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished}
          onChange={(event) => setFormData((prev) => ({ ...prev, isPublished: event.target.checked }))}
          className="rounded border-gray-300"
        />
        <Label htmlFor="isPublished" className="cursor-pointer">
          Publish immediately (students can view)
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {isLoading ? "Saving..." : "Save Recording"}
        </Button>
      </div>
    </div>
  );
};

export default RecordingForm;
