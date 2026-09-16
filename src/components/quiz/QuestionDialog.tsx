"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { QuestionFormFields, QuestionFormValue } from "@/components/quiz/QuestionForm";
import { IQuestion } from "@/types/quiz";
import { Loader2, Plus, Pencil, Save } from "lucide-react";

interface QuestionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Question to edit, or null/undefined to create a new one */
    editingQuestion?: IQuestion | null;
    /** Must throw on failure so the dialog stays open with the user's input */
    onSave: (value: QuestionFormValue) => Promise<void>;
    isSaving: boolean;
    mode?: "admin" | "instructor";
}

export function QuestionDialog({
    open,
    onOpenChange,
    editingQuestion,
    onSave,
    isSaving,
}: QuestionDialogProps) {
    const [formValue, setFormValue] = useState<QuestionFormValue | null>(null);
    const [valid, setValid] = useState(false);
    const [isSavingAnother, setIsSavingAnother] = useState(false);
    const [resetSignal, setResetSignal] = useState(0);

    // Clear local state whenever the dialog opens or the edited question changes
    useEffect(() => {
        if (open) {
            setFormValue(null);
            setValid(false);
        }
    }, [open, editingQuestion?._id]);

    const handleSave = async (addAnother: boolean) => {
        if (!formValue) return;
        setIsSavingAnother(addAnother);
        try {
            await onSave(formValue);
            if (addAnother) {
                // Stay open and clear the form for the next question
                setResetSignal((s) => s + 1);
                setFormValue(null);
            } else {
                onOpenChange(false);
            }
        } finally {
            setIsSavingAnother(false);
        }
    };

    const isEdit = !!editingQuestion;
    const busy = isSaving || isSavingAnother;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isEdit ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {isEdit ? "Edit Question" : "Add Question"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update this question without leaving the quiz page."
                            : "Create a question without leaving the quiz page. Use “Save & add another” to keep going."}
                    </DialogDescription>
                </DialogHeader>

                <QuestionFormFields
                    key={`${isEdit ? editingQuestion?._id : "new"}-${resetSignal}`}
                    initialQuestion={editingQuestion ?? null}
                    resetSignal={resetSignal}
                    onChange={setFormValue}
                    onValidityChange={setValid}
                />

                <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:space-x-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
                        Cancel
                    </Button>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        {!isEdit && (
                            <Button
                                variant="outline"
                                onClick={() => handleSave(true)}
                                disabled={busy || !valid || !formValue}
                            >
                                {isSaving && isSavingAnother ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4 mr-2" />
                                )}
                                Save & add another
                            </Button>
                        )}
                        <Button onClick={() => handleSave(false)} disabled={busy || !valid || !formValue}>
                            {isSaving && !isSavingAnother ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            {isSaving ? "Saving..." : isEdit ? "Save changes" : "Save question"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
