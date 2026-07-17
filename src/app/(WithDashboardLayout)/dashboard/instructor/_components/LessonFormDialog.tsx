"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  useCreateInstructorLessonMutation,
  useUpdateInstructorLessonMutation,
  type InstructorLesson,
} from "@/redux/api/instructorApi";

interface LessonFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  moduleId?: string;
  data?: InstructorLesson;
  onClose: () => void;
  onSuccess: () => void;
}

export function LessonFormDialog({ open, mode, moduleId, data, onClose, onSuccess }: LessonFormDialogProps) {
  const [create, { isLoading: creating }] = useCreateInstructorLessonMutation();
  const [update, { isLoading: updating }] = useUpdateInstructorLessonMutation();
  const [form, setForm] = useState({
    title: data?.title || "",
    description: data?.description || "",
    type: data?.type || "video" as const,
    videoSource: data?.videoSource || "youtube" as const,
    videoId: data?.videoId || "",
    videoUrl: data?.videoUrl || "",
    videoDuration: data?.videoDuration || 0,
    content: data?.content || "",
    isMandatory: data?.isMandatory ?? true,
    resources: (data?.resources || []) as Array<{ title: string; type: "link" | "text"; url: string; textContent: string }>,
  });

  const handleAddResource = () => {
    const newResource: { title: string; type: "link" | "text"; url: string; textContent: string } = { title: '', type: 'link', url: '', textContent: '' };
    setForm({ ...form, resources: [...form.resources, newResource] });
  };

  const handleUpdateResource = (index: number, field: keyof (typeof form.resources)[number], value: string) => {
    const updated = [...form.resources];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, resources: updated });
  };

  const handleRemoveResource = (index: number) => {
    setForm({ ...form, resources: form.resources.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const lessonPayload: Record<string, unknown> = { ...form };
      if (mode === "create") {
        await create({ moduleId: moduleId!, ...lessonPayload }).unwrap();
        toast.success("Lesson created");
      } else {
        await update({ lessonId: data!._id, ...lessonPayload }).unwrap();
        toast.success("Lesson updated");
      }
      onSuccess();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Lesson" : "Edit Lesson"}</DialogTitle>
          <DialogDescription>Fill in the lesson details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input value={form.title} placeholder="Enter title of the lesson..." onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea value={form.description} placeholder="Enter description..." onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v: string) => setForm({ ...form, type: v as 'video' | 'reading' | 'quiz' | 'project' })}>
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
              <div>
                <Label>Video Source</Label>
                <Select value={form.videoSource} onValueChange={(v: string) => setForm({ ...form, videoSource: v as 'youtube' | 'googledrive' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="googledrive">Google Drive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Video ID</Label>
                <Input value={form.videoId} onChange={e => setForm({ ...form, videoId: e.target.value })} placeholder="dQw4w9WgXcQ" />
              </div>
              <div>
                <Label>Duration (seconds)</Label>
                <Input type="number" value={form.videoDuration} onChange={e => setForm({ ...form, videoDuration: parseInt(e.target.value) || 0 })} />
              </div>
            </>
          )}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Resources</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddResource}>
                <Plus className="h-4 w-4 mr-2" />Add Resource
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
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveResource(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <Label className="text-xs">Title *</Label>
                        <Input value={resource.title} onChange={(e) => handleUpdateResource(index, 'title', e.target.value)} placeholder="Resource title" required />
                      </div>
                      <div>
                        <Label className="text-xs">Type *</Label>
                        <Select value={resource.type} onValueChange={(value: "link" | "text") => handleUpdateResource(index, 'type', value)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {resource.type === 'link' && (
                        <div>
                          <Label className="text-xs">URL *</Label>
                          <Input value={resource.url} onChange={(e) => handleUpdateResource(index, 'url', e.target.value)} placeholder="https://example.com" type="url" required />
                        </div>
                      )}
                      {resource.type === 'text' && (
                        <div>
                          <Label className="text-xs">Text Content *</Label>
                          <Textarea value={resource.textContent} onChange={(e) => handleUpdateResource(index, 'textContent', e.target.value)} placeholder="Enter text content..." rows={3} required />
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
