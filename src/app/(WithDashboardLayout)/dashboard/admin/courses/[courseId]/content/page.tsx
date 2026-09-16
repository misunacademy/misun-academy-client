"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetCourseModulesQuery, useGetUnassignedCourseModulesQuery, useUpdateCourseModuleMutation, useDeleteCourseModuleMutation, useReorderModulesMutation } from "@/redux/api/moduleApi";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { useGetAllBatchesQuery } from "@/redux/api/batchApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ModuleCard from "./components/ModuleCard";
import ModuleFormDialog from "./components/ModuleFormDialog";
import LessonFormDialog from "./components/LessonFormDialog";
import { CourseContentHeader } from "./components/CourseContentHeader";
import { BatchSelector } from "./components/BatchSelector";
import { EmptyModuleState } from "./components/EmptyModuleState";
import { DeleteModuleDialog } from "./components/DeleteModuleDialog";
import { LegacyModuleAssigner } from "./components/LegacyModuleAssigner";

interface Module { _id: string; courseId: string; batchId?: string; title: string; description: string; orderIndex: number; estimatedDuration: string; learningObjectives: string[]; status: "draft" | "published"; lessonCount: number }
interface Lesson { _id: string; moduleId: string; title: string; description?: string; type: "video" | "reading" | "quiz" | "project"; orderIndex: number; videoSource?: "youtube" | "googledrive"; videoId?: string; videoUrl?: string; videoDuration?: number; content?: string; isMandatory: boolean; isPublished?: boolean; resources?: { title: string; type: "link" | "text"; url?: string; textContent?: string }[] }
interface Batch { _id: string; title: string; batchNumber: number; status: string }
interface CourseOption { _id: string; title: string }

export default function CourseContentPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const courseId = params.courseId;

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [moduleDialog, setModuleDialog] = useState<{ open: boolean; mode: "create" | "edit"; data?: Module }>({ open: false, mode: "create" });
  const [lessonDialog, setLessonDialog] = useState<{ open: boolean; mode: "create" | "edit"; moduleId?: string; data?: Lesson }>({ open: false, mode: "create" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [legacyModalOpen, setLegacyModalOpen] = useState(false);
  const [legacyCourseId, setLegacyCourseId] = useState<string>(courseId);
  const [orderedModules, setOrderedModules] = useState<Module[]>([]);

  const { data: batchesData } = useGetAllBatchesQuery({ courseId });
  const batches = useMemo(() => (batchesData?.data || []) as Batch[], [batchesData?.data]);

  const { data: coursesData } = useGetAllCoursesQuery({});
  const courses = useMemo(() => (coursesData?.data || []) as CourseOption[], [coursesData?.data]);

  const { data: legacyBatchesData } = useGetAllBatchesQuery({ courseId: legacyCourseId }, { skip: !legacyCourseId });
  const legacyBatches = useMemo(() => (legacyBatchesData?.data || []) as Batch[], [legacyBatchesData?.data]);

  const { data: unassignedData, isLoading: unassignedLoading, refetch: refetchUnassigned } = useGetUnassignedCourseModulesQuery(legacyCourseId, { skip: !legacyCourseId });
  const unassignedModules = useMemo(() => (unassignedData?.data || []) as Module[], [unassignedData?.data]);

  useEffect(() => {
    if (batches.length === 0) return;
    if (!selectedBatchId || !batches.some((batch) => batch._id === selectedBatchId)) {
      setSelectedBatchId(batches[0]._id);
    }
  }, [batches, selectedBatchId]);

  useEffect(() => {
    if (!legacyCourseId && courseId) setLegacyCourseId(courseId);
  }, [courseId, legacyCourseId]);

  const { data: modulesData, isLoading, refetch } = useGetCourseModulesQuery(
    { courseId, batchId: selectedBatchId }, { skip: !selectedBatchId }
  );
  const [updateModule] = useUpdateCourseModuleMutation();
  const [deleteModule] = useDeleteCourseModuleMutation();
  const [reorderModules, { isLoading: reordering }] = useReorderModulesMutation();
  const modules = useMemo(() => (modulesData?.data || []) as Module[], [modulesData?.data]);

  useEffect(() => { setOrderedModules(modules); }, [modules]);

  const toggleModule = useCallback((moduleId: string) => {
    setExpandedModules((prev) => { const ns = new Set(prev); if (ns.has(moduleId)) ns.delete(moduleId); else ns.add(moduleId); return ns; });
  }, []);

  const handleDeleteModule = useCallback(async () => {
    if (!moduleToDelete) return;
    try {
      await deleteModule(moduleToDelete).unwrap();
      toast.success("Module deleted successfully");
      setDeleteDialogOpen(false);
      setModuleToDelete(null);
      refetch();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete module");
      setDeleteDialogOpen(false);
      setModuleToDelete(null);
    }
  }, [moduleToDelete, deleteModule, refetch]);

  const handleMoveModule = useCallback(async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= orderedModules.length) return;
    const next = [...orderedModules];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrderedModules(next);
    try {
      await reorderModules({ courseId, batchId: selectedBatchId, moduleOrders: next.map((m, i) => ({ moduleId: m._id, orderIndex: i })) }).unwrap();
      toast.success("Module order updated");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to reorder modules");
      setOrderedModules(modules);
    }
  }, [orderedModules, reorderModules, courseId, selectedBatchId, modules]);

  const handleLegacyAssign = useCallback(async (moduleId: string, batchId: string) => {
    try {
      await updateModule({ moduleId, batchId }).unwrap();
      toast.success("Module batch assigned");
      await refetchUnassigned();
      refetch();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to assign batch");
      throw error;
    }
  }, [updateModule, refetchUnassigned, refetch]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <CourseContentHeader
        onBack={() => router.push("/dashboard/admin/courses")}
        onFixLegacy={() => setLegacyModalOpen(true)}
        onAddModule={() => setModuleDialog({ open: true, mode: "create" })}
        addModuleDisabled={!selectedBatchId}
      />

      <BatchSelector batches={batches} selectedBatchId={selectedBatchId} onChange={setSelectedBatchId} />

      {!selectedBatchId ? (
        <EmptyModuleState variant="no-batch" />
      ) : orderedModules.length === 0 ? (
        <EmptyModuleState variant="no-modules" onCreateModule={() => setModuleDialog({ open: true, mode: "create" })} />
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
              onEdit={() => setModuleDialog({ open: true, mode: "edit", data: module })}
              onDelete={() => { setModuleToDelete(module._id); setDeleteDialogOpen(true); }}
              onMoveUp={() => handleMoveModule(index, index - 1)}
              onMoveDown={() => handleMoveModule(index, index + 1)}
              onAddLesson={() => setLessonDialog({ open: true, mode: "create", moduleId: module._id })}
              onEditLesson={(lesson) => setLessonDialog({ open: true, mode: "edit", data: lesson })}
            />
          ))}
        </div>
      )}

      {moduleDialog.open && (
        <ModuleFormDialog
          key={`${moduleDialog.mode}-${moduleDialog.data?._id || "create"}-${moduleDialog.open}`}
          open={moduleDialog.open} mode={moduleDialog.mode} data={moduleDialog.data}
          courseId={courseId} batchId={selectedBatchId} batches={batches}
          onBatchChange={setSelectedBatchId}
          onClose={() => setModuleDialog({ open: false, mode: "create" })}
          onSuccess={() => { refetch(); setModuleDialog({ open: false, mode: "create" }); }}
        />
      )}

      {lessonDialog.open && (
        <LessonFormDialog
          key={`${lessonDialog.mode}-${lessonDialog.data?._id || "create"}-${lessonDialog.open}`}
          open={lessonDialog.open} mode={lessonDialog.mode} moduleId={lessonDialog.moduleId} data={lessonDialog.data}
          onClose={() => setLessonDialog({ open: false, mode: "create" })}
          onSuccess={() => { refetch(); setLessonDialog({ open: false, mode: "create" }); }}
        />
      )}

      <LegacyModuleAssigner
        open={legacyModalOpen} onOpenChange={setLegacyModalOpen}
        courses={courses} legacyCourseId={legacyCourseId}
        onCourseChange={setLegacyCourseId}
        unassignedModules={unassignedModules} unassignedLoading={unassignedLoading}
        legacyBatches={legacyBatches} onAssign={handleLegacyAssign}
        onClose={() => setLegacyModalOpen(false)}
      />

      <DeleteModuleDialog
        open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteModule}
        onCancel={() => setModuleToDelete(null)}
      />
    </div>
  );
}
