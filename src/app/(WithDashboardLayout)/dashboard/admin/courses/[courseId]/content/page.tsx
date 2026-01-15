/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Book, Video, FileText, ChevronDown, ChevronRight, Edit, Trash2, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  useGetCourseModulesQuery, 
  useCreateModuleMutation, 
  useUpdateModuleMutation,
  useDeleteModuleMutation 
} from "@/redux/features/module/moduleApi";
import {
  useGetModuleLessonsQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation
} from "@/redux/features/lesson/lessonApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Module {
  _id: string;
  courseId: string;
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

  const { data: modulesData, isLoading, refetch } = useGetCourseModulesQuery(courseId);
  const [createModule] = useCreateModuleMutation();
  const [updateModule] = useUpdateModuleMutation();
  const [deleteModule] = useDeleteModuleMutation();

  const modules = (modulesData?.data || []) as Module[];

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
        <Button onClick={handleCreateModule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      {modules.length === 0 ? (
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
          {modules.map((module, index) => (
            <ModuleCard
              key={module._id}
              module={module}
              index={index}
              expanded={expandedModules.has(module._id)}
              onToggle={() => toggleModule(module._id)}
              onEdit={() => handleEditModule(module)}
              onDelete={() => {
                setModuleToDelete(module._id);
                setDeleteModuleDialogOpen(true);
              }}
              onAddLesson={() => handleCreateLesson(module._id)}
            />
          ))}
        </div>
      )}

      <ModuleFormDialog
        open={moduleDialog.open}
        mode={moduleDialog.mode}
        data={moduleDialog.data}
        courseId={courseId}
        onClose={() => setModuleDialog({ open: false, mode: 'create' })}
        onSuccess={() => {
          refetch();
          setModuleDialog({ open: false, mode: 'create' });
        }}
      />

      <LessonFormDialog
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

function ModuleCard({ module, index, expanded, onToggle, onEdit, onDelete, onAddLesson }: {
  module: Module;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddLesson: () => void;
}) {
  const { data: lessonsData } = useGetModuleLessonsQuery(module._id, { skip: !expanded });
  const [deleteLesson] = useDeleteLessonMutation();
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
                  Module {index + 1}: {module.title}
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
                      <Button variant="ghost" size="sm">
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

function ModuleFormDialog({ open, mode, data, courseId, onClose, onSuccess }: {
  open: boolean;
  mode: 'create' | 'edit';
  data?: Module;
  courseId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [createModule, { isLoading: creating }] = useCreateModuleMutation();
  const [updateModule, { isLoading: updating }] = useUpdateModuleMutation();

  const [formData, setFormData] = useState({
    title: data?.title || '',
    description: data?.description || '',
    estimatedDuration: data?.estimatedDuration || '',
    status: data?.status || 'draft',
    learningObjectives: data?.learningObjectives?.join('\n') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      learningObjectives: formData.learningObjectives.split('\n').filter(Boolean),
    };

    try {
      if (mode === 'create') {
        await createModule({ courseId, ...payload }).unwrap();
        toast.success('Module created successfully');
      } else {
        await updateModule({ moduleId: data!._id, ...payload }).unwrap();
        toast.success('Module updated successfully');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Operation failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Module' : 'Edit Module'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new module to organize course content' : 'Update module information'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Module Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Introduction to Adobe Photoshop"
              required
            />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Learn essential Photoshop tools and techniques for professional graphic design work..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Estimated Duration *</Label>
              <Input
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                placeholder="2 weeks"
                required
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Learning Objectives (one per line)</Label>
            <Textarea
              value={formData.learningObjectives}
              onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
              placeholder="Master Photoshop selection tools and layers
Create professional photo manipulations
Apply advanced masking and compositing techniques
Design graphics for web and print media"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={creating || updating}>
              {(creating || updating) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Create Module' : 'Update Module'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function LessonFormDialog({ open, mode, moduleId, data, onClose, onSuccess }: {
  open: boolean;
  mode: 'create' | 'edit';
  moduleId?: string;
  data?: Lesson;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [createLesson, { isLoading: creating }] = useCreateLessonMutation();
  const [updateLesson, { isLoading: updating }] = useUpdateLessonMutation();

  const [formData, setFormData] = useState({
    title: data?.title || '',
    description: data?.description || '',
    type: data?.type || 'video',
    videoSource: data?.videoSource || 'youtube',
    videoId: data?.videoId || '',
    videoUrl: data?.videoUrl || '',
    videoDuration: data?.videoDuration || 0,
    content: data?.content || '',
    isMandatory: data?.isMandatory ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'create') {
        await createLesson({ moduleId: moduleId!, ...formData }).unwrap();
        toast.success('Lesson created successfully');
        setFormData({
          title: '',
          description: '',
          type: 'video',
          videoSource: 'youtube',
          videoId: '',
          videoUrl: '',
          videoDuration: 0,
          content: '',
          isMandatory: true,
        });
      } else {
        await updateLesson({ lessonId: data!._id, ...formData }).unwrap();
        toast.success('Lesson updated successfully');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Operation failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Lesson' : 'Edit Lesson'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Lesson Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Photoshop Interface and Basic Tools"
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Master the Photoshop workspace, learn essential tools, and create your first design project..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type *</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 mt-8">
              <Switch
                checked={formData.isMandatory}
                onCheckedChange={(checked) => setFormData({ ...formData, isMandatory: checked })}
              />
              <Label>Mandatory</Label>
            </div>
          </div>

          {formData.type === 'video' && (
            <>
              <div>
                <Label>Video Source</Label>
                <Select value={formData.videoSource} onValueChange={(value: any) => setFormData({ ...formData, videoSource: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="gdrive">Google Drive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{formData.videoSource === 'youtube' ? 'YouTube Video ID' : 'Google Drive File ID'} *</Label>
                <Input
                  value={formData.videoId}
                  onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                  placeholder={formData.videoSource === 'youtube' ? 'dQw4w9WgXcQ' : '1a2b3c4d5e6f7g8h9i0j'}
                />
                {formData.videoSource === 'youtube' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    YouTube URL: https://www.youtube.com/watch?v=<strong>VIDEO_ID</strong>
                  </p>
                )}
                {formData.videoSource === 'googledrive' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Google Drive URL: https://drive.google.com/file/d/<strong>FILE_ID</strong>/view
                  </p>
                )}
              </div>
              <div>
                <Label>Duration (seconds)</Label>
                <Input
                  type="number"
                  value={formData.videoDuration}
                  onChange={(e) => setFormData({ ...formData, videoDuration: parseInt(e.target.value) })}
                  placeholder="300"
                />
              </div>
            </>
          )}

          {(formData.type === 'reading' || formData.type === 'project') && (
            <div>
              <Label>Content</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="## Photoshop Tools Overview

### Essential Tools for Graphic Designers

**Selection Tools:**
- Marquee tools for geometric selections
- Lasso tools for freeform selections
- Magic Wand for color-based selections

**Image Editing:**
- Clone Stamp for content removal
- Healing Brush for photo retouching
- Content-Aware Fill for intelligent removal

### Practice Exercise
Create a composite image using at least 3 different selection techniques..."
                rows={8}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={creating || updating}>
              {(creating || updating) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Create Lesson' : 'Update Lesson'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
