/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDeleteModuleLessonMutation, useGetModuleLessonsQuery } from "@/redux/api/lessonApi";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Video, FileText, ChevronDown, ChevronRight, Edit, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";


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


const ModuleCard = ({
  module,
  position,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  reordering,
  onAddLesson,
  onEditLesson,
}: {
  module: Module;
  position: number;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  reordering: boolean;
  onAddLesson: () => void;
  onEditLesson: (lesson: Lesson) => void;
}) => {
  const { data: lessonsData } = useGetModuleLessonsQuery(module._id, { skip: !expanded });
  const [deleteLesson] = useDeleteModuleLessonMutation();
  const lessons = (lessonsData?.data || []) as Lesson[];
  const [deleteLessonDialogOpen, setDeleteLessonDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);

  const handleDeleteLesson = async () => {
    if (!lessonToDelete) return;
    
    try {
      await deleteLesson(lessonToDelete).unwrap();
      toast.success('Lesson deleted successfully');
      setDeleteLessonDialogOpen(false);
      setLessonToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete lesson');
      setDeleteLessonDialogOpen(false);
      setLessonToDelete(null);
    }
  };

  return (
    <Card>
      <CardHeader className="cursor-pointer hover:bg-muted/50" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
            {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">
                  Module {position}: {module.title}
                </CardTitle>
                <Badge variant={module.status === 'published' ? 'default' : 'secondary'}>
                  {module.status}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                {module.description} • {module.lessonCount} lessons • {module.estimatedDuration}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" onClick={onMoveUp} disabled={!canMoveUp || reordering}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onMoveDown} disabled={!canMoveDown || reordering}>
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Lessons</h4>
              <Button variant="outline" size="sm" onClick={onAddLesson}>
                <Plus className="h-4 w-4 mr-2" />
                Add Lesson
              </Button>
            </div>
            
            {lessons.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No lessons yet</p>
            ) : (
              <div className="space-y-2">
                {lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson._id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      {lesson.type === 'video' && <Video className="h-4 w-4" />}
                      {lesson.type === 'reading' && <FileText className="h-4 w-4" />}
                      <div>
                        <p className="font-medium text-sm">
                          Lesson {lessonIndex + 1}: {lesson.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lesson.type} {lesson.videoDuration ? `• ${Math.round(lesson.videoDuration / 60)} min` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.isMandatory && <Badge variant="outline" className="text-xs">Required</Badge>}
                      <Button variant="ghost" size="sm" onClick={() => onEditLesson(lesson)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setLessonToDelete(lesson._id);
                        setDeleteLessonDialogOpen(true);
                      }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      )}

      {/* Delete Lesson Confirmation Dialog */}
      <AlertDialog open={deleteLessonDialogOpen} onOpenChange={setDeleteLessonDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lesson
              from this module.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLessonToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLesson} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Lesson
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export default ModuleCard;