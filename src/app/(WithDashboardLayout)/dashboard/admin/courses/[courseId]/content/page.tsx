/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Book} from "lucide-react";
import { 
  useGetCourseModulesQuery, 
  useGetUnassignedCourseModulesQuery,
  useUpdateCourseModuleMutation,
  useDeleteCourseModuleMutation,
  useReorderModulesMutation
} from "@/redux/api/moduleApi";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useGetAllBatchesQuery } from "@/redux/api/batchApi";
import ModuleCard from "./components/ModuleCard";
import ModuleFormDialog from "./components/ModuleFormDialog";
import LessonFormDialog from "./components/LessonFormDialog";

interface Module {
  _id: string;
  courseId: string;
  batchId?: string;
  title: string;
  description: string;
  orderIndex: number;
  estimatedDuration: string;
  learningObjectives: string[];
  status: 'draft' | 'published';
  lessonCount: number;
}

interface Lesson {
  _id: string;
  moduleId: string;
  title: string;
  description?: string;
  type: 'video' | 'reading' | 'quiz' | 'project';
  orderIndex: number;
  videoSource?: 'youtube' | 'googledrive';
  videoId?: string;
  videoUrl?: string;
  videoDuration?: number;
  content?: string;
  isMandatory: boolean;
  resources?: {
    title: string;
    type: 'link' | 'text';
    url?: string;
    textContent?: string;
  }[];
}

interface Batch {
  _id: string;
  title: string;
  batchNumber: number;
  status: string;
}

interface CourseOption {
  _id: string;
  title: string;
}

export default function CourseContentPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const courseId = params.courseId;

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [moduleDialog, setModuleDialog] = useState<{ open: boolean; mode: 'create' | 'edit'; data?: Module }>({ open: false, mode: 'create' });
  const [lessonDialog, setLessonDialog] = useState<{ open: boolean; mode: 'create' | 'edit'; moduleId?: string; data?: Lesson }>({ open: false, mode: 'create' });
  const [deleteModuleDialogOpen, setDeleteModuleDialogOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [legacyModalOpen, setLegacyModalOpen] = useState(false);
  const [legacyCourseId, setLegacyCourseId] = useState<string>(courseId);
  const [legacyAssignments, setLegacyAssignments] = useState<Record<string, string>>({});
  const [updatingLegacyId, setUpdatingLegacyId] = useState<string | null>(null);
  const [orderedModules, setOrderedModules] = useState<Module[]>([]);

  const { data: batchesData } = useGetAllBatchesQuery({ courseId });
  const batches = useMemo(
    () => (batchesData?.data || []) as Batch[],
    [batchesData?.data]
  );

  const { data: coursesData } = useGetAllCoursesQuery({});
  const courses = useMemo(
    () => (coursesData?.data || []) as CourseOption[],
    [coursesData?.data]
  );

  const { data: legacyBatchesData } = useGetAllBatchesQuery(
    { courseId: legacyCourseId },
    { skip: !legacyCourseId }
  );
  const legacyBatches = useMemo(
    () => (legacyBatchesData?.data || []) as Batch[],
    [legacyBatchesData?.data]
  );

  const {
    data: unassignedData,
    isLoading: unassignedLoading,
    refetch: refetchUnassigned,
  } = useGetUnassignedCourseModulesQuery(legacyCourseId, { skip: !legacyCourseId });
  const unassignedModules = useMemo(
    () => (unassignedData?.data || []) as Module[],
    [unassignedData?.data]
  );

  useEffect(() => {
    if (batches.length === 0) return;
    if (!selectedBatchId || !batches.some((batch) => batch._id === selectedBatchId)) {
      setSelectedBatchId(batches[0]._id);
    }
  }, [batches, selectedBatchId]);

  useEffect(() => {
    if (!legacyCourseId && courseId) {
      setLegacyCourseId(courseId);
    }
  }, [courseId, legacyCourseId]);

  useEffect(() => {
    setLegacyAssignments({});
  }, [legacyCourseId]);

  const { data: modulesData, isLoading, refetch } = useGetCourseModulesQuery(
    { courseId, batchId: selectedBatchId },
    { skip: !selectedBatchId }
  );
  const [updateModule] = useUpdateCourseModuleMutation();
  const [deleteModule] = useDeleteCourseModuleMutation();
  const [reorderModules, { isLoading: reordering }] = useReorderModulesMutation();

  const modules = useMemo(
    () => (modulesData?.data || []) as Module[],
    [modulesData?.data]
  );

  useEffect(() => {
    setOrderedModules(modules);
  }, [modules]);
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const handleCreateModule = () => {
    setModuleDialog({ open: true, mode: 'create' });
  };

  const handleEditModule = (module: Module) => {
    setModuleDialog({ open: true, mode: 'edit', data: module });
  };

  const handleDeleteModule = async () => {
    if (!moduleToDelete) return;
    
    try {
      await deleteModule(moduleToDelete).unwrap();
      toast.success('Module deleted successfully');
      setDeleteModuleDialogOpen(false);
      setModuleToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete module');
      setDeleteModuleDialogOpen(false);
      setModuleToDelete(null);
    }
  };

  const handleCreateLesson = (moduleId: string) => {
    setLessonDialog({ open: true, mode: 'create', moduleId });
  };

  const handleEditLesson = (lesson: Lesson) => {
    setLessonDialog({ open: true, mode: 'edit', data: lesson });
  };

  const handleMoveModule = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= orderedModules.length) return;

    const next = [...orderedModules];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrderedModules(next);

    const moduleOrders = next.map((module, index) => ({
      moduleId: module._id,
      orderIndex: index,
    }));

    try {
      await reorderModules({ courseId, batchId: selectedBatchId, moduleOrders }).unwrap();
      toast.success('Module order updated');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to reorder modules');
      setOrderedModules(modules);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.push('/dashboard/admin/courses')} className="mb-2">
            ← Back to Courses
          </Button>
          <h1 className="text-3xl font-bold">Course Content</h1>
          <p className="text-muted-foreground">Manage modules and lessons for this course</p>
        </div>
        <Button onClick={handleCreateModule} disabled={!selectedBatchId}>
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => setLegacyModalOpen(true)}>
          Fix Legacy Modules
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Label className="text-sm text-muted-foreground">Batch</Label>
        <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="Select a batch" />
          </SelectTrigger>
          <SelectContent>
            {batches.map((batch) => (
              <SelectItem key={batch._id} value={batch._id}>
                {batch.title} - {batch.status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedBatchId ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Select a batch to manage modules.</p>
          </CardContent>
        </Card>
      ) : orderedModules.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No modules yet. Create your first module to get started.</p>
            <Button onClick={handleCreateModule} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create First Module
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orderedModules.map((module, index) => (
            <ModuleCard
              key={module._id}
              module={module}
              position={index + 1}
              canMoveUp={index > 0}
              canMoveDown={index < orderedModules.length - 1}
              reordering={reordering}
              expanded={expandedModules.has(module._id)}
              onToggle={() => toggleModule(module._id)}
              onEdit={() => handleEditModule(module)}
              onDelete={() => {
                setModuleToDelete(module._id);
                setDeleteModuleDialogOpen(true);
              }}
              onMoveUp={() => handleMoveModule(index, index - 1)}
              onMoveDown={() => handleMoveModule(index, index + 1)}
              onAddLesson={() => handleCreateLesson(module._id)}
              onEditLesson={handleEditLesson}
            />
          ))}
        </div>
      )}

      {moduleDialog.open && (
        <ModuleFormDialog
          key={`${moduleDialog.mode}-${moduleDialog.data?._id || 'create'}-${moduleDialog.open ? 'open' : 'closed'}`}
          open={moduleDialog.open}
          mode={moduleDialog.mode}
          data={moduleDialog.data}
          courseId={courseId}
          batchId={selectedBatchId}
          batches={batches}
          onBatchChange={setSelectedBatchId}
          onClose={() => setModuleDialog({ open: false, mode: 'create' })}
          onSuccess={() => {
            refetch();
            setModuleDialog({ open: false, mode: 'create' });
          }}
        />
      )}

      {lessonDialog.open && (
        <LessonFormDialog
          key={`${lessonDialog.mode}-${lessonDialog.data?._id || 'create'}-${lessonDialog.open ? 'open' : 'closed'}`}
          open={lessonDialog.open}
          mode={lessonDialog.mode}
          moduleId={lessonDialog.moduleId}
          data={lessonDialog.data}
          onClose={() => setLessonDialog({ open: false, mode: 'create' })}
          onSuccess={() => {
            refetch();
            setLessonDialog({ open: false, mode: 'create' });
          }}
        />
      )}

      <Dialog open={legacyModalOpen} onOpenChange={setLegacyModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Assign Batch to Legacy Modules</DialogTitle>
            <DialogDescription>
              Modules created before batch support can be assigned here.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Label>Course</Label>
              <Select value={legacyCourseId} onValueChange={setLegacyCourseId}>
                <SelectTrigger className="w-[320px]">
                  <SelectValue placeholder="Select a course" />
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

            {unassignedLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : unassignedModules.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">No unassigned modules for this course.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {unassignedModules.map((module) => {
                  const assignedBatchId = legacyAssignments[module._id] || "";
                  return (
                    <div key={module._id} className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <p className="font-medium">{module.title}</p>
                        <p className="text-xs text-muted-foreground">Order {module.orderIndex}</p>
                      </div>
                      <div className="flex flex-1 items-center gap-2 md:justify-end">
                        <Select
                          value={assignedBatchId}
                          onValueChange={(value) =>
                            setLegacyAssignments((prev) => ({ ...prev, [module._id]: value }))
                          }
                          disabled={legacyBatches.length === 0}
                        >
                          <SelectTrigger className="w-[240px]">
                            <SelectValue placeholder="Select batch" />
                          </SelectTrigger>
                          <SelectContent>
                            {legacyBatches.map((batch) => (
                              <SelectItem key={batch._id} value={batch._id}>
                                {batch.title} · #{batch.batchNumber} · {batch.status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          disabled={!assignedBatchId || updatingLegacyId === module._id}
                          onClick={async () => {
                            if (!assignedBatchId) return;
                            try {
                              setUpdatingLegacyId(module._id);
                              await updateModule({ moduleId: module._id, batchId: assignedBatchId } as any).unwrap();
                              toast.success('Module batch assigned');
                              setLegacyAssignments((prev) => {
                                const next = { ...prev };
                                delete next[module._id];
                                return next;
                              });
                              await refetchUnassigned();
                              refetch();
                            } catch (error: any) {
                              toast.error(error?.data?.message || 'Failed to assign batch');
                            } finally {
                              setUpdatingLegacyId(null);
                            }
                          }}
                        >
                          {updatingLegacyId === module._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Assign'
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLegacyModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Module Confirmation Dialog */}
      <AlertDialog open={deleteModuleDialogOpen} onOpenChange={setDeleteModuleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Module?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the module
              and all its lessons from the course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setModuleToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteModule} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Module
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}





