import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { ReactNode } from "react";
import type { InstructorCourse } from "@/redux/api/instructorApi";
import RecordingForm, { type RecordingFormValues } from "./RecordingForm";

interface RecordingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  trigger?: ReactNode;
  defaultValues?: Partial<RecordingFormValues>;
  courses: InstructorCourse[];
  onSubmit: (values: RecordingFormValues) => Promise<void>;
  isLoading: boolean;
}

const RecordingFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  defaultValues,
  courses,
  onSubmit,
  isLoading,
}: RecordingFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <RecordingForm
          defaultValues={defaultValues}
          courses={courses}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RecordingFormDialog;
