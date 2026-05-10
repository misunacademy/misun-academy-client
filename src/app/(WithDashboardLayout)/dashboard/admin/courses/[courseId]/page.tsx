/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useState } from "react";
import CourseForm from "../CourseForm";
import {
  useAssignCourseInstructorMutation,
  useGetAllInstructorProfilesQuery,
  useGetCourseByIdQuery,
} from "@/redux/api/courseApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, UserCheck, X } from "lucide-react";
import { toast } from "sonner";

interface EditCoursePageProps {
  params: Promise<{ courseId: string }>;
}

// Instructor is now a plain User with role=instructor: { _id, name, email, image }
export function InstructorAssignDialog({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);
  const { data: courseData } = useGetCourseByIdQuery(courseId);
  const { data: instructorsData, isLoading: instructorsLoading } =
    useGetAllInstructorProfilesQuery({ unassignedOnly: true });
  const [assignInstructor, { isLoading: isSaving }] =
    useAssignCourseInstructorMutation();

  const instructors = (instructorsData?.data || []) as any[];

  const course = courseData as any;
  const currentInstructorId: string | null =
    course?.instructorId?._id?.toString() ||
    (typeof course?.instructorId === "string" ? course.instructorId : null);
  const currentInstructorName: string = course?.instructorId?.name || "";

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null | undefined>(undefined);

  const effectiveId: string | null =
    selectedId !== undefined ? selectedId : currentInstructorId;

  const filtered = instructors.filter((inst: any) => {
    const q = search.toLowerCase();
    return (
      (inst.name || "").toLowerCase().includes(q) ||
      (inst.email || "").toLowerCase().includes(q)
    );
  });

  const currentInst = instructors.find(
    (i: any) => i._id?.toString() === effectiveId
  );
  const displayName = currentInst?.name || currentInstructorName || "Instructor";

  const handleSave = async () => {
    try {
      await assignInstructor({ courseId, instructorId: effectiveId }).unwrap();
      toast.success(
        effectiveId ? "Instructor assigned successfully" : "Instructor removed"
      );
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign instructor");
    }
  };

  const handleRemove = async () => {
    try {
      await assignInstructor({ courseId, instructorId: null }).unwrap();
      setSelectedId(undefined);
      toast.success("Instructor removed");
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove instructor");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserCheck className="w-4 h-4" />
          {currentInstructorId ? `Instructor: ${currentInstructorName || "Assigned"}` : "Assign Instructor"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            Assign Instructor
          </DialogTitle>
          <DialogDescription>
            One instructor per course. Select from users with the instructor role.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Currently selected */}
          {effectiveId ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Selected:</span>
              <Badge variant="secondary" className="gap-1">
                {displayName}
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No instructor assigned yet.</p>
          )}

          {/* Search */}
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* List */}
          {instructorsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : instructors.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No users with the instructor role found. Create one from the Users page.
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No instructors match your search.
            </p>
          ) : (
            <ScrollArea className="h-52 border rounded-md p-2">
              <div className="space-y-1">
                {filtered.map((inst: any) => {
                  const instId = inst._id?.toString();
                  const isSelected = effectiveId === instId;
                  return (
                    <div
                      key={instId}
                      onClick={() => setSelectedId(isSelected ? null : instId)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      {/* Radio indicator */}
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {inst.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {inst.email}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            {currentInstructorId && (
              <Button variant="outline" onClick={handleRemove} disabled={isSaving}>
                Remove
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={isSaving || effectiveId === currentInstructorId}
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const { courseId } = use(params);
  return (
    <div>
      <CourseForm courseId={courseId} isNew={false} />
      
    </div>
  );
}