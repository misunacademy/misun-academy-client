"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  BookOpen, Users, Layers, Plus, ChevronDown, ChevronRight,
  Edit, Trash2, Book,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetInstructorCoursesQuery,
  useGetInstructorCourseModulesQuery,
  useDeleteInstructorModuleMutation,
  useReorderInstructorModulesMutation,
  type InstructorModule,
  type InstructorCourse,
} from "@/redux/api/instructorApi";
import { useGetInstructorDashboardQuery } from "@/redux/api/dashboardApi";
import { ModuleCard } from "./ModuleCard";
import { ModuleFormDialog } from "./ModuleFormDialog";

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; color: string;
}) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value ?? "—"}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InstructorDashboardPage() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading: dashLoading } = useGetInstructorDashboardQuery();
  const { data: coursesData, isLoading: coursesLoading } = useGetInstructorCoursesQuery();

  const [moduleDialog, setModuleDialog] = useState<{ open: boolean; mode: "create" | "edit"; data?: InstructorModule }>({ open: false, mode: "create" });
  const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null);
  const [deleteModule] = useDeleteInstructorModuleMutation();

  const dashData = dashboardData?.data as { course?: { instructorId?: { name?: string; image?: string; avatar?: string } | null }; enrolledStudents?: number; activeBatches?: number; totalBatches?: number } | undefined;
  const course = (coursesData?.data?.[0]) as InstructorCourse | undefined;
  const courseId = course?._id || "";
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const batchIds = course?.batches?.map((batch) => batch._id) || [];
  const defaultBatchId = course?.batches?.[0]?._id || "";
  const activeBatchId = selectedBatchId && batchIds.includes(selectedBatchId) ? selectedBatchId : defaultBatchId;

  const { data: modulesData, isLoading: modulesLoading, refetch } = useGetInstructorCourseModulesQuery(
    { courseId, batchId: activeBatchId },
    { skip: !courseId || !activeBatchId },
  );
  const modules = useMemo(() => (modulesData?.data || []) as InstructorModule[], [modulesData?.data]);
  const [orderedModules, setOrderedModules] = useState<InstructorModule[]>([]);
  const [reorderModules, { isLoading: reordering }] = useReorderInstructorModulesMutation();

  const instructorRecord = dashData?.course?.instructorId;
  const instructorName = instructorRecord?.name || user?.name || "";
  const avatarUrl = instructorRecord?.image || instructorRecord?.avatar || user?.image || user?.avatar;
  const initials = (instructorName || "Instructor").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => { setOrderedModules(modules); }, [modules]);

  const handleDeleteModule = async () => {
    if (!deleteModuleId) return;
    try {
      await deleteModule(deleteModuleId).unwrap();
      toast.success("Module deleted");
      setDeleteModuleId(null);
      refetch();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Delete failed");
      setDeleteModuleId(null);
    }
  };

  const handleMoveModule = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= orderedModules.length) return;
    const next = [...orderedModules];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrderedModules(next);
    const moduleOrders = next.map((mod, index) => ({ moduleId: mod._id, orderIndex: index }));
    try {
      await reorderModules({ courseId, batchId: activeBatchId, moduleOrders }).unwrap();
      toast.success("Module order updated");
    } catch {
      setOrderedModules(modules);
      toast.error("Reorder failed");
    }
  };

  const isLoading = dashLoading || coursesLoading;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 ring-2 ring-primary/10">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={instructorName || "Instructor"} />}
          <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Welcome back{instructorName ? `, ${instructorName}` : ""}! 👋</h1>
          <p className="text-muted-foreground mt-1">Manage your course content and track student progress.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={Users} label="Enrolled Students" value={dashData?.enrolledStudents ?? 0} color="bg-violet-500" />
          <StatCard icon={Layers} label="Active Batches" value={dashData?.activeBatches ?? 0} color="bg-blue-500" />
          <StatCard icon={BookOpen} label="Total Batches" value={dashData?.totalBatches ?? 0} color="bg-emerald-500" />
        </div>
      )}

      {isLoading ? (
        <Skeleton className="h-28 rounded-xl" />
      ) : !course ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">No course assigned yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Contact your admin to get assigned to a course.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-5 flex items-center gap-4">
            {course.thumbnailImage ? (
              <Image src={course.thumbnailImage} alt={course.title} width={80} height={80} className="w-20 h-20 rounded-lg object-cover shrink-0" unoptimized />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold truncate">{course.title}</h2>
                <Badge variant={course.status === "published" ? "default" : "secondary"} className="capitalize">{course.status || "draft"}</Badge>
              </div>
              {course.shortDescription && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.shortDescription}</p>}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {course.batches?.map(b => (
                  <Badge key={b._id} variant="outline" className="text-xs">Batch #{b.title.split(' ')[1]} · {b.currentEnrollment} students</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {course && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Course Modules</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Batch</span>
              <Select value={activeBatchId} onValueChange={setSelectedBatchId}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {course.batches?.map((batch) => (
                    <SelectItem key={batch._id} value={batch._id}>{batch.title} - {batch.status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setModuleDialog({ open: true, mode: "create" })} disabled={!activeBatchId}>
              <Plus className="h-4 w-4 mr-2" />Add Module
            </Button>
          </div>

          {modulesLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : !activeBatchId ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Book className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Select a batch to manage modules.</p>
              </CardContent>
            </Card>
          ) : orderedModules.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Book className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No modules yet.</p>
                <Button className="mt-4" onClick={() => setModuleDialog({ open: true, mode: "create" })}>
                  <Plus className="h-4 w-4 mr-2" />Create First Module
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {orderedModules.map((mod, i) => (
                <ModuleCard
                  key={mod._id}
                  module={mod}
                  position={i + 1}
                  onEdit={() => setModuleDialog({ open: true, mode: "edit", data: mod })}
                  onDelete={() => setDeleteModuleId(mod._id)}
                  onMoveUp={() => handleMoveModule(i, i - 1)}
                  onMoveDown={() => handleMoveModule(i, i + 1)}
                  canMoveUp={i > 0}
                  canMoveDown={i < orderedModules.length - 1}
                  reordering={reordering}
                  onRefetch={refetch}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {moduleDialog.open && course && (
        <ModuleFormDialog
          key={`${moduleDialog.mode}-${moduleDialog.data?._id || "new"}`}
          open={moduleDialog.open} mode={moduleDialog.mode}
          courseId={courseId} batchId={activeBatchId}
          batches={course.batches || []}
          onBatchChange={setSelectedBatchId}
          data={moduleDialog.data}
          onClose={() => setModuleDialog({ open: false, mode: "create" })}
          onSuccess={() => { setModuleDialog({ open: false, mode: "create" }); refetch(); }}
        />
      )}

      <AlertDialog open={!!deleteModuleId} onOpenChange={() => setDeleteModuleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Module?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the module. Delete all lessons first.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteModule} className="bg-destructive text-white hover:bg-destructive/90">Delete Module</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
