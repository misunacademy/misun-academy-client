import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Edit, Eye, Trash2, Video } from "lucide-react"
import { format } from "date-fns"
import type { Recording } from "@/redux/api/recordingApi"

export function useRecordingColumns(
  onPlay: (recording: Recording) => void,
  onEdit: (recording: Recording) => void,
  onDelete: (recording: Recording) => void,
  isDeleting: boolean,
): ColumnDef<Recording>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">{row.original.title}</p>
            <p className="text-sm text-muted-foreground">
              {row.original.videoSource === "youtube" ? "YouTube" : "Google Drive"}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "courseBatch",
      header: "Course/Batch",
      cell: ({ row }) => {
        const r = row.original
        return (
          <div className="text-sm">
            <p className="font-medium">
              {typeof r.courseId === "object" && r.courseId !== null ? r.courseId.title : "N/A"}
            </p>
            <p className="text-muted-foreground">
              {typeof r.batchId === "object" && r.batchId !== null ? r.batchId.title : "N/A"}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: "sessionDate",
      header: "Session Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {format(new Date(row.original.sessionDate), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) =>
        row.original.duration ? (
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {row.original.duration} min
          </div>
        ) : null,
    },
    {
      accessorKey: "isPublished",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isPublished ? "default" : "secondary"}>
          {row.original.isPublished ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const r = row.original
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" aria-label="Play recording" onClick={() => onPlay(r)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" aria-label="Edit recording" onClick={() => onEdit(r)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" aria-label="Delete recording" onClick={() => onDelete(r)} disabled={isDeleting}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
}
