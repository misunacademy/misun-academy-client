import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { YoutubePrivatePlayer } from "@/components/shared/youtube-private-player";
import type { Recording } from "@/redux/api/recordingApi";

interface RecordingPreviewDialogProps {
  recording: Recording | null;
  onOpenChange: (open: boolean) => void;
}

const resolveUrl = (recording: Recording): string | null => {
  if (recording.videoUrl) return recording.videoUrl;
  if (recording.videoSource === "youtube" && recording.videoId) {
    return `https://www.youtube.com/watch?v=${recording.videoId}`;
  }
  return null;
};

const RecordingPreviewDialog = ({ recording, onOpenChange }: RecordingPreviewDialogProps) => {
  return (
    <Dialog open={!!recording} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full bg-[#060f0a] border border-primary/25 text-white">
        <DialogHeader>
          <DialogTitle>{recording?.title}</DialogTitle>
        </DialogHeader>
        {recording ? (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden">
            <YoutubePrivatePlayer url={resolveUrl(recording) ?? ""} className="absolute inset-0 w-full h-full" />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default RecordingPreviewDialog;
