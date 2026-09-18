import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LessonVideoPlayer } from "@/components/shared/lesson-video-player";
import type { Recording } from "@/redux/api/recordingApi";

interface RecordingPreviewDialogProps {
  recording: Recording | null;
  onOpenChange: (open: boolean) => void;
}

const RecordingPreviewDialog = ({ recording, onOpenChange }: RecordingPreviewDialogProps) => {
  return (
    <Dialog open={!!recording} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full bg-surface border border-primary/25 text-white">
        <DialogHeader>
          <DialogTitle>{recording?.title}</DialogTitle>
        </DialogHeader>
        {recording ? (
          <LessonVideoPlayer
            key={recording._id}
            url={recording.videoUrl}
            videoSource={recording.videoSource}
            videoId={recording.videoId}
            title={recording.title}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default RecordingPreviewDialog;
