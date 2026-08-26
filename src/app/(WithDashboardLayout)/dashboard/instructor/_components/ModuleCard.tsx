"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { YoutubePrivatePlayer } from "@/components/shared/youtube-private-player";
import {
  ChevronDown, ChevronRight, Edit, Trash2, Video, FileText,
  GripVertical, ArrowUp, ArrowDown, Plus, Eye, ClipboardCheck,
} from "lucide-react";
import {
  useGetInstructorModuleLessonsQuery,
  useGetInstructorModuleQuizzesQuery,
  useDeleteInstructorLessonMutation,
  type InstructorModule,
  type InstructorLesson,
  type InstructorModuleQuiz,
} from "@/redux/api/instructorApi";
import { LessonFormDialog } from "./LessonFormDialog";

interface ModuleCardProps {
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
}

export function ModuleCard({
  module, position, onEdit, onDelete, onMoveUp, onMoveDown,
  canMoveUp, canMoveDown, reordering, onRefetch,
}: ModuleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [lessonDialog, setLessonDialog] = useState<{ open: boolean; mode: "create" | "edit"; data?: InstructorLesson }>({ open: false, mode: "create" });
  const [deleteLessonId, setDeleteLessonId] = useState<string | null>(null);
  const [playingLesson, setPlayingLesson] = useState<InstructorLesson | null>(null);
  const router = useRouter();
  const [deleteLesson] = useDeleteInstructorLessonMutation();
  const { data: lessonsData, refetch: refetchLessons } = useGetInstructorModuleLessonsQuery(module._id, { skip: !expanded });
  const { data: quizzesData } = useGetInstructorModuleQuizzesQuery(module._id, { skip: !expanded });
  const quizzes: InstructorModuleQuiz[] = quizzesData?.data ?? [];
  const lessons = (lessonsData?.data || []) as InstructorLesson[];

  const resolveLessonUrl = (lesson: InstructorLesson): string | null => {
    if (lesson.videoUrl) return lesson.videoUrl;
    if (lesson.videoSource === "youtube" && lesson.videoId) return `https://www.youtube.com/watch?v=${lesson.videoId}`;
    if (lesson.videoSource === "googledrive" && lesson.videoId) return `https://drive.google.com/file/d/${lesson.videoId}/preview`;
    return null;
  };

  const handleDeleteLesson = async () => {
    if (!deleteLessonId) return;
    try {
      await deleteLesson(deleteLessonId).unwrap();
      toast.success("Lesson deleted");
      setDeleteLessonId(null);
      refetchLessons();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Delete failed");
      setDeleteLessonId(null);
    }
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
              <CardDescription className="text-xs mt-0.5">{module.description || "No description"} • {module.lessonCount} lessons{quizzes.length > 0 ? ` • ${quizzes.length} quizzes` : ""} • {module.estimatedDuration || "—"}</CardDescription>
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
                    <Button variant="ghost" size="sm" aria-label="View lesson" onClick={() => setPlayingLesson(lesson)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" aria-label="Edit lesson" onClick={() => setLessonDialog({ open: true, mode: "edit", data: lesson })}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" aria-label="Delete lesson" onClick={() => setDeleteLessonId(lesson._id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-4 mb-3">
            <h4 className="font-medium text-sm">Quizzes</h4>
            <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/instructor/quizzes/create?moduleId=${module._id}`)}>
              <Plus className="h-4 w-4 mr-1" />Add Quiz
            </Button>
          </div>
          {quizzes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No quizzes yet.</p>
          ) : (
            <div className="space-y-2">
              {quizzes.map((quiz, qi) => (
                <div
                  key={quiz._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 cursor-pointer"
                  onClick={() => router.push(`/dashboard/instructor/quizzes/${quiz._id}`)}
                >
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">Quiz {qi + 1}: {quiz.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {quiz.totalQuestions || 0} questions · {quiz.totalMarks || 0} marks
                        {quiz.timeLimit ? ` · ${quiz.timeLimit} min` : ""}
                      </p>
                    </div>
                  </div>
                  <Badge variant={quiz.status === "published" ? "default" : "secondary"} className="text-xs">{quiz.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}

      <Dialog open={!!playingLesson} onOpenChange={(open) => { if (!open) setPlayingLesson(null); }}>
        <DialogContent className="max-w-4xl w-full bg-surface border border-primary/25 text-white">
          <DialogHeader>
            <DialogTitle>{playingLesson?.title}</DialogTitle>
            {playingLesson?.type && <DialogDescription className="text-white/70 capitalize">{playingLesson.type}</DialogDescription>}
          </DialogHeader>
          {playingLesson ? (() => {
            const lessonUrl = resolveLessonUrl(playingLesson);
            if (playingLesson.type === "video" && lessonUrl) {
              if (playingLesson.videoSource === "googledrive") {
                return (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                    <iframe src={lessonUrl} className="absolute inset-0 w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={playingLesson.title} />
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
              return <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm text-white/90">{playingLesson.content}</div>;
            }
            return <p className="text-sm text-white/70">No preview available for this lesson.</p>;
          })() : null}
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
