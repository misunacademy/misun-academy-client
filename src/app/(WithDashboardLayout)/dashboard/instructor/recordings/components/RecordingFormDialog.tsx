import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { InstructorCourse } from "@/redux/api/instructorApi";
import RecordingForm, { RecordingFormData } from "./RecordingForm";

interface RecordingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  trigger?: ReactNode;
  formData: RecordingFormData;
  setFormData: Dispatch<SetStateAction<RecordingFormData>>;
  courses: InstructorCourse[];
  onSubmit: () => void;
  isLoading: boolean;
}

const RecordingFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  formData,
  setFormData,
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
          formData={formData}
          setFormData={setFormData}
          courses={courses}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RecordingFormDialog;
