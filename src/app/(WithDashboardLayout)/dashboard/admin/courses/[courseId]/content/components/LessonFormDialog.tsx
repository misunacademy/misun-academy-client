/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateModuleLessonMutation, useUpdateModuleLessonMutation } from "@/redux/api/lessonApi";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

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

const LessonFormDialog = ({ open, mode, moduleId, data, onClose, onSuccess }: {
    open: boolean;
    mode: 'create' | 'edit';
    moduleId?: string;
    data?: Lesson;
    onClose: () => void;
    onSuccess: () => void;
}) => {
    const [createLesson, { isLoading: creating }] = useCreateModuleLessonMutation();
    const [updateLesson, { isLoading: updating }] = useUpdateModuleLessonMutation();

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
        resources: data?.resources || [],
    });

    const handleAddResource = () => {
        setFormData({
            ...formData,
            resources: [...formData.resources, { title: '', type: 'link', url: '', textContent: '' }]
        });
    };

    const handleUpdateResource = (index: number, field: string, value: string) => {
        const updatedResources = [...formData.resources];
        updatedResources[index] = { ...updatedResources[index], [field]: value };
        setFormData({ ...formData, resources: updatedResources });
    };

    const handleRemoveResource = (index: number) => {
        setFormData({
            ...formData,
            resources: formData.resources.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (mode === 'create') {
                await createLesson({ moduleId: moduleId!, ...formData }).unwrap();
                toast.success('Lesson created successfully');
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
                                        <SelectItem value="googledrive">Google Drive</SelectItem>
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

                    {/* Resources Section */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label>Resources</Label>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddResource}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Resource
                            </Button>
                        </div>
                        {formData.resources.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No resources added yet</p>
                        ) : (
                            <div className="space-y-3">
                                {formData.resources.map((resource, index) => (
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
                            {mode === 'create' ? 'Create Lesson' : 'Update Lesson'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default LessonFormDialog;