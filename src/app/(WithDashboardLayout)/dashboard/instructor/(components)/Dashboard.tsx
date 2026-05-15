/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, Users, Layers, Plus, ChevronDown, ChevronRight,
  Edit, Trash2, Video, FileText, Loader2, GripVertical, Book, ArrowUp, ArrowDown,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { YoutubePrivatePlayer } from "@/components/shared/youtube-private-player";
import {
  useGetInstructorCoursesQuery,
  useGetInstructorCourseModulesQuery,
  useCreateInstructorModuleMutation,
  useReorderInstructorModulesMutation,
  useUpdateInstructorModuleMutation,
  useDeleteInstructorModuleMutation,
  useGetInstructorModuleLessonsQuery,
  useCreateInstructorLessonMutation,
  useUpdateInstructorLessonMutation,
  useDeleteInstructorLessonMutation,
  type InstructorModule,
  type InstructorLesson,
  type InstructorCourse,
} from "@/redux/api/instructorApi";
import { useGetInstructorDashboardQuery } from "@/redux/api/dashboardApi";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
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

// ─── Lesson Form Dialog ───────────────────────────────────────────────────────
function LessonFormDialog({ open, mode, moduleId, data, onClose, onSuccess }: {
  open: boolean; mode: "create" | "edit"; moduleId?: string; data?: InstructorLesson;
  onClose: () => void; onSuccess: () => void;
}) {
  const [create, { isLoading: creating }] = useCreateInstructorLessonMutation();
  const [update, { isLoading: updating }] = useUpdateInstructorLessonMutation();
  const [form, setForm] = useState({
    title: data?.title || "",
    description: data?.description || "",
    type: data?.type || "video",
    videoSource: data?.videoSource || "youtube",
    videoId: data?.videoId || "",
    videoUrl: data?.videoUrl || "",
    videoDuration: data?.videoDuration || 0,
    content: data?.content || "",
    isMandatory: data?.isMandatory ?? true,
    resources: data?.resources || [],
  });

  const handleAddResource = () => {
    setForm({
      ...form,
      resources: [...form.resources, { title: '', type: 'link', url: '', textContent: '' }]
    });
  };

  const handleUpdateResource = (index: number, field: string, value: string) => {
    const updatedResources = [...form.resources];
    updatedResources[index] = { ...updatedResources[index], [field]: value };
    setForm({ ...form, resources: updatedResources });
  };

  const handleRemoveResource = (index: number) => {
    setForm({
      ...form,
      resources: form.resources.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "create") {
        await create({ moduleId: moduleId!, ...form } as any).unwrap();
        toast.success("Lesson created");
      } else {
        await update({ lessonId: data!._id, ...form } as any).unwrap();
        toast.success("Lesson updated");
      }
      onSuccess();
    } catch (err: any) { toast.error(err?.data?.message || "Operation failed"); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Lesson" : "Edit Lesson"}</DialogTitle>
          <DialogDescription>Fill in the lesson details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Title *</Label>
            <Input value={form.title} placeholder="Enter title of the lesson..." onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
          <div><Label>Description *</Label>
            <Textarea value={form.description} placeholder="Enter description of the lesson..." onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Type</Label>
              <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <Switch checked={form.isMandatory} onCheckedChange={v => setForm({ ...form, isMandatory: v })} />
              <Label>Mandatory</Label>
            </div>
          </div>
          {form.type === "video" && (
            <>
              <div><Label>Video Source</Label>
                <Select value={form.videoSource} onValueChange={(v: any) => setForm({ ...form, videoSource: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="googledrive">Google Drive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Video ID</Label>
                <Input value={form.videoId} onChange={e => setForm({ ...form, videoId: e.target.value })} placeholder="dQw4w9WgXcQ" /></div>
              <div>
                {form.videoSource === 'youtube' && (
                  <p className="text-xs text-muted-foreground ">
                    YouTube URL: https://www.youtube.com/watch?v=<strong>VIDEO_ID</strong>
                  </p>
                )}
                {form.videoSource === 'googledrive' && (
                  <p className="text-xs text-muted-foreground ">
                    Google Drive URL: https://drive.google.com/file/d/<strong>FILE_ID</strong>/view
                  </p>
                )}
                <Label>Duration (seconds)</Label>
                <Input type="number" value={form.videoDuration} onChange={e => setForm({ ...form, videoDuration: parseInt(e.target.value) || 0 })} /></div>
            </>
          )}

          {/*  */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Resources</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddResource}>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>
            {form.resources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No resources added yet</p>
            ) : (
              <div className="space-y-3">
                {form.resources.map((resource, index) => (
                  <Card key={index} className="p-3">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Resource {index + 1}</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveResource(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <Label className="text-xs">Title *</Label>
                        <Input
                          value={resource.title}
                          onChange={(e) => handleUpdateResource(index, 'title', e.target.value)}
                          placeholder="Resource title"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Type *</Label>
                        <Select
                          value={resource.type}
                          onValueChange={(value) => handleUpdateResource(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {resource.type === 'link' && (
                        <div>
                          <Label className="text-xs">URL *</Label>
                          <Input
                            value={resource.url}
                            onChange={(e) => handleUpdateResource(index, 'url', e.target.value)}
                            placeholder="https://example.com"
                            type="url"
                            required
                          />
                        </div>
                      )}
                      {resource.type === 'text' && (
                        <div>
                          <Label className="text-xs">Text Content *</Label>
                          <Textarea
                            value={resource.textContent}
                            onChange={(e) => handleUpdateResource(index, 'textContent', e.target.value)}
                            placeholder="Enter text content here..."
                            rows={3}
                            required
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={creating || updating}>
              {(creating || updating) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Module Form Dialog ───────────────────────────────────────────────────────
function ModuleFormDialog({ open, mode, courseId, batchId, batches, onBatchChange, data, onClose, onSuccess }: {
  open: boolean; mode: "create" | "edit"; courseId: string; batchId: string;
  batches: InstructorCourse["batches"];
  onBatchChange: (batchId: string) => void;
  data?: InstructorModule;
  onClose: () => void; onSuccess: () => void;
}) {
  const [create, { isLoading: creating }] = useCreateInstructorModuleMutation();
  const [update, { isLoading: updating }] = useUpdateInstructorModuleMutation();
  const [form, setForm] = useState({
    title: data?.title || "",
    description: data?.description || "",
    estimatedDuration: data?.estimatedDuration || "",
    status: data?.status || "draft",
    learningObjectives: data?.learningObjectives?.join("\n") || "",
  });

  const currentBatchId = data?.batchId || batchId;
  const currentBatch = batches.find((batch) => batch._id === currentBatchId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, learningObjectives: form.learningObjectives.split("\n").filter(Boolean) };
    try {
      if (mode === "create") {
        await create({ courseId, batchId: currentBatchId, ...payload } as any).unwrap();
        toast.success("Module created");
      } else {
        await update({ moduleId: data!._id, ...payload } as any).unwrap();
        toast.success("Module updated");
      }
      onSuccess();
    } catch (err: any) { toast.error(err?.data?.message || "Operation failed"); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Module" : "Edit Module"}</DialogTitle>
          <DialogDescription>{mode === "create" ? "Create a new module." : "Update module details."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Batch *</Label>
            {mode === "create" ? (
              <Select value={currentBatchId} onValueChange={onBatchChange}>
                <SelectTrigger><SelectValue placeholder="Select a batch" /></SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch._id} value={batch._id}>
                      {batch.title} - {batch.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={currentBatch ? `${currentBatch.title} · #${currentBatch.batchNumber} · ${currentBatch.status}` : ""}
                disabled
              />
            )}
          </div>
          <div><Label>Title *</Label>
            <Input value={form.title}
              placeholder="Enter title of the module..."
              onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
          <div><Label>Description *</Label>
            <Textarea value={form.description}
              placeholder="Enter description of the module..."
              onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Estimated Duration *</Label>
              <Input value={form.estimatedDuration} onChange={e => setForm({ ...form, estimatedDuration: e.target.value })} placeholder="2 weeks" required /></div>
            <div><Label>Status</Label>
              <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Learning Objectives (one per line)</Label>
            <Textarea value={form.learningObjectives}
              placeholder="E.g.- Understand basic concepts\n- Apply knowledge in projects"
              onChange={e => setForm({ ...form, learningObjectives: e.target.value })} rows={4} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={creating || updating}>
              {(creating || updating) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Module Card ──────────────────────────────────────────────────────────────
function ModuleCard({
  module,
  position,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  reordering,
  onRefetch,
}: {
  module: InstructorModule;
  position: number;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  reordering: boolean;
  onRefetch: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [lessonDialog, setLessonDialog] = useState<{ open: boolean; mode: "create" | "edit"; data?: InstructorLesson }>({ open: false, mode: "create" });
  const [deleteLessonId, setDeleteLessonId] = useState<string | null>(null);
  const [playingLesson, setPlayingLesson] = useState<InstructorLesson | null>(null);
  const [deleteLesson] = useDeleteInstructorLessonMutation();
  const { data: lessonsData, refetch: refetchLessons } = useGetInstructorModuleLessonsQuery(module._id, { skip: !expanded });
  const lessons = (lessonsData?.data || []) as InstructorLesson[];

  const resolveLessonUrl = (lesson: InstructorLesson): string | null => {
    if (lesson.videoUrl) return lesson.videoUrl;
    if (lesson.videoSource === "youtube" && lesson.videoId) {
      return `https://www.youtube.com/watch?v=${lesson.videoId}`;
    }
    if (lesson.videoSource === "googledrive" && lesson.videoId) {
      return `https://drive.google.com/file/d/${lesson.videoId}/preview`;
    }
    return null;
  };

  const handleDeleteLesson = async () => {
    if (!deleteLessonId) return;
    try {
      await deleteLesson(deleteLessonId).unwrap();
      toast.success("Lesson deleted");
      setDeleteLessonId(null);
      refetchLessons();
    } catch (err: any) { toast.error(err?.data?.message || "Delete failed"); setDeleteLessonId(null); }
  };

  return (
    <Card className="border">
      <CardHeader className="cursor-pointer hover:bg-muted/40 transition-colors pb-3" onClick={() => setExpanded(p => !p)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
            {expanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-sm">Module {position}: {module.title}</CardTitle>
                <Badge variant={module.status === "published" ? "default" : "secondary"} className="text-xs">{module.status}</Badge>
              </div>
              <CardDescription className="text-xs mt-0.5">{module.description} • {module.lessonCount} lessons • {module.estimatedDuration}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2" onClick={e => e.stopPropagation()}>
            <Button variant="ghost" size="sm" onClick={onMoveUp} disabled={!canMoveUp || reordering}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onMoveDown} disabled={!canMoveDown || reordering}>
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit}><Edit className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">Lessons</h4>
            <Button variant="outline" size="sm" onClick={() => setLessonDialog({ open: true, mode: "create" })}>
              <Plus className="h-4 w-4 mr-1" />Add Lesson
            </Button>
          </div>
          {lessons.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No lessons yet.</p>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson, li) => (
                <div key={lesson._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    {lesson.type === "video" ? <Video className="h-4 w-4 text-blue-500" /> : <FileText className="h-4 w-4 text-green-500" />}
                    <div>
                      <p className="text-sm font-medium">Lesson {li + 1}: {lesson.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {lesson.type}{lesson.videoDuration ? ` • ${Math.round(lesson.videoDuration / 60)} min` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {lesson.isMandatory && <Badge variant="outline" className="text-xs">Required</Badge>}

                    <Button variant="ghost" size="sm" onClick={() => setPlayingLesson(lesson)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setLessonDialog({ open: true, mode: "edit", data: lesson })}><Edit className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteLessonId(lesson._id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}

      <Dialog
        open={!!playingLesson}
        onOpenChange={(open) => {
          if (!open) setPlayingLesson(null);
        }}
      >
        <DialogContent className="max-w-4xl w-full bg-[#060f0a] border border-primary/25 text-white">
          <DialogHeader>
            <DialogTitle>{playingLesson?.title}</DialogTitle>
            {playingLesson?.type && (
              <DialogDescription className="text-white/70 capitalize">
                {playingLesson.type}
              </DialogDescription>
            )}
          </DialogHeader>
          {playingLesson ? (
            (() => {
              const lessonUrl = resolveLessonUrl(playingLesson);
              if (playingLesson.type === "video" && lessonUrl) {
                if (playingLesson.videoSource === "googledrive") {
                  return (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                      <iframe
                        src={lessonUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title={playingLesson.title}
                      />
                    </div>
                  );
                }
                return (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                    <YoutubePrivatePlayer url={lessonUrl} className="absolute inset-0 w-full h-full" />
                  </div>
                );
              }

              if (playingLesson.type !== "video" && playingLesson.content) {
                return (
                  <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm text-white/90">
                    {playingLesson.content}
                  </div>
                );
              }

              return (
                <p className="text-sm text-white/70">No preview available for this lesson.</p>
              );
            })()
          ) : null}
        </DialogContent>
      </Dialog>

      {lessonDialog.open && (
        <LessonFormDialog
          key={`${lessonDialog.mode}-${lessonDialog.data?._id || "new"}`}
          open={lessonDialog.open} mode={lessonDialog.mode}
          moduleId={module._id} data={lessonDialog.data}
          onClose={() => setLessonDialog({ open: false, mode: "create" })}
          onSuccess={() => { setLessonDialog({ open: false, mode: "create" }); refetchLessons(); onRefetch(); }}
        />
      )}

      <AlertDialog open={!!deleteLessonId} onOpenChange={() => setDeleteLessonId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLesson} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InstructorDashboardPage() {
  const { data: dashboardData, isLoading: dashLoading } = useGetInstructorDashboardQuery();
  const { data: coursesData, isLoading: coursesLoading } = useGetInstructorCoursesQuery();

  const [moduleDialog, setModuleDialog] = useState<{ open: boolean; mode: "create" | "edit"; data?: InstructorModule }>({ open: false, mode: "create" });
  const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null);
  const [deleteModule] = useDeleteInstructorModuleMutation();

  const dashData = dashboardData?.data;
  const course = (coursesData?.data?.[0]) as InstructorCourse | undefined;
  const courseId = course?._id || "";
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const batchIds = course?.batches?.map((batch) => batch._id) || [];
  const defaultBatchId = course?.batches?.[0]?._id || "";
  const activeBatchId = selectedBatchId && batchIds.includes(selectedBatchId)
    ? selectedBatchId
    : defaultBatchId;

  const { data: modulesData, isLoading: modulesLoading, refetch } = useGetInstructorCourseModulesQuery(
    { courseId, batchId: activeBatchId },
    { skip: !courseId || !activeBatchId }
  );
  const modules = useMemo(
    () => (modulesData?.data || []) as InstructorModule[],
    [modulesData?.data]
  );
  const [orderedModules, setOrderedModules] = useState<InstructorModule[]>([]);
  const [reorderModules, { isLoading: reordering }] = useReorderInstructorModulesMutation();

  useEffect(() => {
    setOrderedModules(modules);
  }, [modules]);

  const handleDeleteModule = async () => {
    if (!deleteModuleId) return;
    try {
      await deleteModule(deleteModuleId).unwrap();
      toast.success("Module deleted");
      setDeleteModuleId(null);
      refetch();
    } catch (err: any) { toast.error(err?.data?.message || "Delete failed"); setDeleteModuleId(null); }
  };

  const isLoading = dashLoading || coursesLoading;

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
      await reorderModules({ courseId, batchId: activeBatchId, moduleOrders }).unwrap();
      toast.success("Module order updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Reorder failed");
      setOrderedModules(modules);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back{dashData?.course?.instructorId?.name ? `, ${(dashData.course.instructorId as any).name}` : ""}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">Manage your course content and track student progress.</p>
      </div>

      {/* Stats */}
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

      {/* Course Info Banner */}
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
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.thumbnailImage} alt={course.title} className="w-20 h-20 rounded-lg object-cover shrink-0" />
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

      {/* Course Content Manager */}
      {course && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Course Modules</h2>
            <div className="flex items-center gap-3">
              <Label className="text-sm text-muted-foreground">Batch</Label>
              <Select value={activeBatchId} onValueChange={setSelectedBatchId}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {course.batches?.map((batch) => (
                    <SelectItem key={batch._id} value={batch._id}>
                      {batch.title} - {batch.status}
                    </SelectItem>
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

      {/* Module Form Dialog */}
      {moduleDialog.open && course && (
        <ModuleFormDialog
          key={`${moduleDialog.mode}-${moduleDialog.data?._id || "new"}`}
          open={moduleDialog.open} mode={moduleDialog.mode}
          courseId={courseId}
          batchId={activeBatchId}
          batches={course.batches || []}
          onBatchChange={setSelectedBatchId}
          data={moduleDialog.data}
          onClose={() => setModuleDialog({ open: false, mode: "create" })}
          onSuccess={() => { setModuleDialog({ open: false, mode: "create" }); refetch(); }}
        />
      )}

      {/* Delete Module Dialog */}
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
