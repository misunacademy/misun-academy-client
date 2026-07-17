import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { CourseResponse } from "@/redux/api/courseApi";
import type { BatchResponse } from "@/redux/api/batchApi";
import RecordingForm, { type RecordingFormValues } from "./RecordingForm";

interface RecordingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpen?: () => void;
  trigger?: ReactNode;
  title: string;
  description: string;
  defaultValues?: Partial<RecordingFormValues>;
  courses: CourseResponse[];
  batches: BatchResponse[];
  onSubmit: (values: RecordingFormValues) => Promise<void>;
  isLoading: boolean;
}

const RecordingFormDialog = ({
  open,
  onOpenChange,
  onOpen,
  trigger,
  title,
  description,
  defaultValues,
  courses,
  batches,
  onSubmit,
  isLoading,
}: RecordingFormDialogProps) => {
  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (nextOpen && onOpen) {
      onOpen();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <RecordingForm
          defaultValues={defaultValues}
          courses={courses}
          batches={batches}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RecordingFormDialog;
