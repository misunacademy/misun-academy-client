"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { useGetAllBatchesQuery } from "@/redux/api/batchApi";
import { useGetBootcampCatalogAdminQuery } from "@/redux/api/bootcampApi";
import {
  EnrollmentPerkRule,
  PerkBenefit,
  useCreatePerkRuleMutation,
  useUpdatePerkRuleMutation,
} from "@/redux/api/enrollmentPerkApi";

interface PerkRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRule?: EnrollmentPerkRule | null;
}

interface PerkRuleFormProps {
  editingRule?: EnrollmentPerkRule | null;
  onClose: () => void;
}

function PerkRuleForm({ editingRule, onClose }: PerkRuleFormProps) {
  const initialCourseId =
    typeof editingRule?.courseId === "object"
      ? editingRule?.courseId._id
      : editingRule?.courseId || "";

  const initialBatchId =
    typeof editingRule?.batchId === "object"
      ? editingRule?.batchId._id
      : editingRule?.batchId || "";

  const [courseId, setCourseId] = useState(initialCourseId);
  const [batchId, setBatchId] = useState(initialBatchId);
  const [title, setTitle] = useState(editingRule?.title || "");
  const [isActive, setIsActive] = useState(editingRule?.isActive ?? true);
  const [startDate, setStartDate] = useState(
    editingRule?.startDate
      ? new Date(editingRule.startDate).toISOString().slice(0, 10)
      : ""
  );
  const [endDate, setEndDate] = useState(
    editingRule?.endDate
      ? new Date(editingRule.endDate).toISOString().slice(0, 10)
      : ""
  );
  const [note, setNote] = useState(editingRule?.note || "");
  const [revokeOnCancel, setRevokeOnCancel] = useState(
    editingRule?.revokeOnCancel ?? true
  );
  const [applyToAdminGrants, setApplyToAdminGrants] = useState(
    editingRule?.applyToAdminGrants ?? true
  );

  const [benefits, setBenefits] = useState<PerkBenefit[]>(() => {
    if (editingRule?.benefits && editingRule.benefits.length > 0) {
      return editingRule.benefits.map((b) => ({
        type: b.type,
        targetCourseId:
          typeof b.targetCourseId === "object"
            ? b.targetCourseId?._id
            : b.targetCourseId,
        targetBatchId:
          typeof b.targetBatchId === "object"
            ? b.targetBatchId?._id
            : b.targetBatchId,
        targetBootcampId:
          typeof b.targetBootcampId === "object"
            ? (b.targetBootcampId as { _id: string } | undefined)?._id
            : b.targetBootcampId,
        accessDuration: b.accessDuration || { type: "lifetime" },
        extraConfig: b.extraConfig || {},
      }));
    }
    return [
      {
        type: "free_course",
        targetCourseId: "",
        targetBatchId: undefined,
        accessDuration: { type: "lifetime" },
        extraConfig: {},
      },
    ];
  });

  const { data: coursesData, isLoading: loadingCourses } = useGetAllCoursesQuery({});
  const courses = coursesData?.data || [];

  const { data: bootcampsData, isLoading: loadingBootcamps } =
    useGetBootcampCatalogAdminQuery({ limit: 100 });
  const bootcamps = bootcampsData?.data || [];

  const isBootcampPublished = (b: (typeof bootcamps)[number]) => {
    if (b.status === "draft" || b.status === "archived") return false;
    return b.recordedStatus === "published" || (b.status as string) === "published";
  };

  const publishedBootcamps = bootcamps.filter(isBootcampPublished);

  const { data: batchesData, isLoading: loadingBatches } = useGetAllBatchesQuery(
    { courseId: courseId || undefined },
    { skip: !courseId }
  );
  const batches = batchesData?.data || [];

  const [createRule, { isLoading: isCreating }] = useCreatePerkRuleMutation();
  const [updateRule, { isLoading: isUpdating }] = useUpdatePerkRuleMutation();
  const isSubmitting = isCreating || isUpdating;

  // Auto-generate title suggestion if empty
  const handleCourseChange = (selectedCourseId: string) => {
    setCourseId(selectedCourseId);
    setBatchId(""); // Reset batch when course changes
    const selectedCourse = courses.find((c) => c._id === selectedCourseId);
    if (selectedCourse && !title) {
      setTitle(`${selectedCourse.title} - Enrollment Perk`);
    }
  };

  const handleAddBenefit = () => {
    setBenefits((prev) => [
      ...prev,
      {
        type: "free_course",
        targetCourseId: "",
        targetBatchId: undefined,
        accessDuration: { type: "lifetime" },
        extraConfig: {},
      },
    ]);
  };

  const handleRemoveBenefit = (index: number) => {
    if (benefits.length === 1) {
      toast.error("At least one benefit is required");
      return;
    }
    setBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  const updateBenefit = (index: number, patch: Partial<PerkBenefit>) => {
    setBenefits((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId) {
      toast.error("Please select a Course");
      return;
    }
    if (!batchId) {
      toast.error("Please select a Batch");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a rule Title");
      return;
    }

    // Validate benefits
    for (const b of benefits) {
      if (b.type === "free_course") {
        if (!b.targetCourseId) {
          toast.error("Please select a target course for all free course benefits");
          return;
        }
        if (b.targetCourseId === courseId) {
          toast.error("A benefit course cannot be the same as the enrolled course");
          return;
        }
        if (b.accessDuration?.type === "days" && (!b.accessDuration.days || b.accessDuration.days <= 0)) {
          toast.error("Please enter a valid number of days for access duration");
          return;
        }
      } else if (b.type === "free_bootcamp") {
        if (!b.targetBootcampId) {
          toast.error("Please select a target bootcamp for all free bootcamp benefits");
          return;
        }
      }
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      toast.error("End date must be on or after start date");
      return;
    }

    const cleanedBenefits = benefits.map((b) => {
      if (b.type === "free_bootcamp") {
        return {
          type: b.type,
          targetBootcampId: b.targetBootcampId || undefined,
          extraConfig: b.extraConfig || {},
        };
      }
      return {
        type: b.type,
        targetCourseId: b.targetCourseId || undefined,
        targetBatchId: b.targetBatchId || undefined,
        accessDuration: b.accessDuration || { type: "lifetime" },
        extraConfig: b.extraConfig || {},
      };
    });

    const payload = {
      courseId,
      batchId,
      title: title.trim(),
      isActive,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
      note: note.trim() || null,
      revokeOnCancel,
      applyToAdminGrants,
      benefits: cleanedBenefits,
    };

    try {
      if (editingRule) {
        await updateRule({ id: editingRule._id, data: payload }).unwrap();
        toast.success("Perk rule updated successfully");
      } else {
        await createRule(payload).unwrap();
        toast.success("Perk rule created successfully");
      }
      onClose();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to save perk rule");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-2">
      {/* Course & Batch Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="courseSelect">Source Course *</Label>
          <Select value={courseId} onValueChange={handleCourseChange}>
            <SelectTrigger id="courseSelect">
              <SelectValue placeholder={loadingCourses ? "Loading courses..." : "Select Course"} />
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
          <Label htmlFor="batchSelect">Source Batch *</Label>
          <Select
            value={batchId}
            onValueChange={setBatchId}
            disabled={!courseId || loadingBatches}
          >
            <SelectTrigger id="batchSelect">
              <SelectValue
                placeholder={
                  !courseId
                    ? "Select Course first"
                    : loadingBatches
                    ? "Loading batches..."
                    : batches.length === 0
                    ? "No batches found"
                    : "Select Batch"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch._id} value={batch._id}>
                  {batch.title} 
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="ruleTitle">Rule Title *</Label>
        <Input
          id="ruleTitle"
          placeholder="e.g., Batch 5 Free Bootcamp Access Perk"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Benefits Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Configured Benefits</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddBenefit}
            className="gap-1 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Another Benefit
          </Button>
        </div>

        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-primary/20 bg-muted/30 space-y-4 relative"
            >
              {/* Benefit header: label + type selector + remove */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary shrink-0">
                  Benefit #{index + 1}
                </span>
                <div className="flex items-center gap-2 flex-1">
                  <Select
                    value={benefit.type}
                    onValueChange={(val: "free_course" | "free_bootcamp") =>
                      updateBenefit(index, {
                        type: val,
                        targetCourseId: val === "free_course" ? benefit.targetCourseId : undefined,
                        targetBootcampId: val === "free_bootcamp" ? benefit.targetBootcampId : undefined,
                        targetBatchId: undefined,
                        accessDuration:
                          val === "free_bootcamp"
                            ? undefined
                            : benefit.accessDuration || { type: "lifetime" },
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs w-auto min-w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free_course">Free Course Access</SelectItem>
                      <SelectItem value="free_bootcamp">Free Bootcamp Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {benefits.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveBenefit(index)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>

              {/* FREE COURSE fields */}
              {benefit.type === "free_course" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Target Free Course *</Label>
                    <Select
                      value={benefit.targetCourseId || ""}
                      onValueChange={(val) => updateBenefit(index, { targetCourseId: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Bonus Course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses
                          .filter((c) => c._id !== courseId)
                          .map((c) => (
                            <SelectItem key={c._id} value={c._id}>
                              {c.title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {benefit.targetCourseId === courseId && (
                      <p className="text-xs text-destructive">
                        Target course cannot be the same as enrolled course
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Access Duration</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={benefit.accessDuration?.type || "lifetime"}
                        onValueChange={(val: "lifetime" | "days") =>
                          updateBenefit(index, {
                            accessDuration: {
                              type: val,
                              days: val === "days" ? benefit.accessDuration?.days || 30 : undefined,
                            },
                          })
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lifetime">Lifetime</SelectItem>
                          <SelectItem value="days">Days Limit</SelectItem>
                        </SelectContent>
                      </Select>

                      {benefit.accessDuration?.type === "days" && (
                        <div className="flex-1">
                          <Input
                            type="number"
                            min={1}
                            placeholder="Days"
                            value={benefit.accessDuration?.days || ""}
                            onChange={(e) =>
                              updateBenefit(index, {
                                accessDuration: {
                                  type: "days",
                                  days: parseInt(e.target.value, 10) || 1,
                                },
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FREE BOOTCAMP fields */}
              {benefit.type === "free_bootcamp" && (
                <div className="space-y-2">
                  <Label className="text-xs">Target Free Bootcamp *</Label>
                  <Select
                    value={benefit.targetBootcampId || ""}
                    onValueChange={(val) => updateBenefit(index, { targetBootcampId: val })}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingBootcamps
                            ? "Loading bootcamps..."
                            : publishedBootcamps.length === 0
                            ? "No published bootcamps available"
                            : "Choose Bonus Bootcamp"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {bootcamps
                        .filter(
                          (b) =>
                            b._id === benefit.targetBootcampId || isBootcampPublished(b)
                        )
                        .map((b) => (
                          <SelectItem key={b._id} value={b._id}>
                            {b.title}
                            {b.season ? ` — Season ${b.season}` : ""}
                          </SelectItem>
                        ))}
                      {publishedBootcamps.length === 0 && !benefit.targetBootcampId && (
                        <div className="py-3 px-2 text-center text-xs text-muted-foreground">
                          No published bootcamps available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    Students will receive free lifetime access to this bootcamp.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Date range & Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div className="space-y-2">
          <Label htmlFor="startDate">Offer Start Date (Optional)</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Offer End Date (Optional)</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Policy switches */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/40 border">
        <div className="flex items-center justify-between md:flex-col md:items-start gap-2">
          <div>
            <Label className="font-semibold text-sm">Rule Status</Label>
            <p className="text-xs text-muted-foreground">Active for new enrollments</p>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>

        <div className="flex items-center justify-between md:flex-col md:items-start gap-2">
          <div>
            <Label className="font-semibold text-sm">Revoke on Refund</Label>
            <p className="text-xs text-muted-foreground">Revoke perk if cancelled</p>
          </div>
          <Switch checked={revokeOnCancel} onCheckedChange={setRevokeOnCancel} />
        </div>

        <div className="flex items-center justify-between md:flex-col md:items-start gap-2">
          <div>
            <Label className="font-semibold text-sm">Admin Grants</Label>
            <p className="text-xs text-muted-foreground">Apply to manual grants</p>
          </div>
          <Switch checked={applyToAdminGrants} onCheckedChange={setApplyToAdminGrants} />
        </div>
      </div>

      {/* Internal note */}
      <div className="space-y-2">
        <Label htmlFor="note">Internal Admin Note (Optional)</Label>
        <Textarea
          id="note"
          placeholder="e.g. Special campaign promotion for early bird students..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-1.5">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {editingRule ? "Save Changes" : "Create Rule"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function PerkRuleDialog({
  open,
  onOpenChange,
  editingRule,
}: PerkRuleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle>
                {editingRule ? "Edit Enrollment Perk Rule" : "Create Enrollment Perk Rule"}
              </DialogTitle>
              <DialogDescription>
                Configure bonus courses and benefits granted automatically to students enrolling in this batch.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {open && (
          <PerkRuleForm
            key={editingRule?._id || "new-rule"}
            editingRule={editingRule}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
