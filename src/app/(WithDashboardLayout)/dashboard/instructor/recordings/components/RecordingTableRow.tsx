import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Edit, PlayCircle, Trash2, Video } from "lucide-react";
import { format } from "date-fns";
import type { Recording } from "@/redux/api/recordingApi";

interface RecordingTableRowProps {
  recording: Recording;
  onPreview: (recording: Recording) => void;
  onEdit: (recording: Recording) => void;
  onDelete: (recording: Recording) => void;
  getPreviewUrl: (recording: Recording) => string | null;
  isDeleting?: boolean;
}

const RecordingTableRow = ({
  recording,
  onPreview,
  onEdit,
  onDelete,
  getPreviewUrl,
  isDeleting = false,
}: RecordingTableRowProps) => {
  const previewUrl = getPreviewUrl(recording);

  return (
    <>
      <TableCell>
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="font-medium">{recording.title}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {recording.videoSource === "youtube" ? "YouTube" : "Google Drive"}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="text-sm">
          <p className="font-medium">
            {typeof recording.courseId === "object" ? recording.courseId.title : "-"}
          </p>
          <p className="text-muted-foreground">
            {typeof recording.batchId === "object" ? recording.batchId.title : "-"}
          </p>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {format(new Date(recording.sessionDate), "MMM dd, yyyy")}
        </div>
      </TableCell>

      <TableCell>
        {recording.duration ? (
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {recording.duration} min
          </div>
        ) : null}
      </TableCell>

      <TableCell>
        <Badge variant={recording.isPublished ? "default" : "secondary"}>
          {recording.isPublished ? "Published" : "Draft"}
        </Badge>
      </TableCell>

      <TableCell>
        {previewUrl ? (
          <Button variant="ghost" size="sm" onClick={() => onPreview(recording)}>
            <PlayCircle className="h-4 w-4" />
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">N/A</span>
        )}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(recording)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:text-destructive"
            onClick={() => onDelete(recording)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </>
  );
};

export default RecordingTableRow;
