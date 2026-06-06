import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { YoutubePrivatePlayer } from "@/components/shared/youtube-private-player";
import type { Recording } from "@/redux/api/recordingApi";

interface RecordingPreviewDialogProps {
  open: boolean;
  recording: Recording | null;
  onOpenChange: (open: boolean) => void;
  getRecordingUrl: (recording?: Recording | null) => string;
}

const RecordingPreviewDialog = ({
  open,
  recording,
  onOpenChange,
  getRecordingUrl,
}: RecordingPreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full bg-[#060f0a] border border-primary/25 text-white">
        <DialogHeader>
          <DialogTitle>{recording?.title}</DialogTitle>
        </DialogHeader>
        {recording ? (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden">
            <YoutubePrivatePlayer
              url={getRecordingUrl(recording)}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default RecordingPreviewDialog;
