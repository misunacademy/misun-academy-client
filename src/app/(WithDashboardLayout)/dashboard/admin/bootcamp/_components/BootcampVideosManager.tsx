'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Pencil, Trash2, Video } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { BootcampCatalogItem, BootcampVideo } from '@/redux/api/bootcampApi';
import {
    useAddBootcampVideoMutation,
    useUpdateBootcampVideoMutation,
    useDeleteBootcampVideoMutation,
} from '@/redux/api/bootcampApi';

const emptyVideo = {
    title: '',
    description: '',
    videoSource: 'youtube' as 'youtube' | 'googledrive',
    videoId: '',
    duration: '',
    isPublished: true,
};

interface BootcampVideosManagerProps {
    bootcamp: BootcampCatalogItem | null;
}

export default function BootcampVideosManager({ bootcamp }: BootcampVideosManagerProps) {
    const [addVideo, { isLoading: isAdding }] = useAddBootcampVideoMutation();
    const [updateVideo, { isLoading: isUpdatingVideo }] = useUpdateBootcampVideoMutation();
    const [deleteVideo, { isLoading: isDeleting }] = useDeleteBootcampVideoMutation();

    const [videoDialogOpen, setVideoDialogOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<BootcampVideo | null>(null);
    const [videoForm, setVideoForm] = useState(emptyVideo);
    const [deleteTarget, setDeleteTarget] = useState<BootcampVideo | null>(null);

    if (!bootcamp) return null;

    const videos = [...(bootcamp.videos ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);

    const openAddVideo = () => {
        setEditingVideo(null);
        setVideoForm(emptyVideo);
        setVideoDialogOpen(true);
    };

    const openEditVideo = (v: BootcampVideo) => {
        setEditingVideo(v);
        setVideoForm({
            title: v.title ?? '',
            description: v.description ?? '',
            videoSource: v.videoSource ?? 'youtube',
            videoId: v.videoId ?? '',
            duration: v.duration ? String(Math.round(v.duration / 60)) : '',
            isPublished: v.isPublished ?? true,
        });
        setVideoDialogOpen(true);
    };

    const handleSaveVideo = async () => {
        if (!videoForm.title.trim() || !videoForm.videoId.trim()) {
            toast.error('Title and video ID are required');
            return;
        }
        const payload = {
            title: videoForm.title.trim(),
            description: videoForm.description.trim() || undefined,
            videoSource: videoForm.videoSource,
            videoId: videoForm.videoId.trim(),
            duration: videoForm.duration ? Number(videoForm.duration) * 60 : 0,
            isPublished: videoForm.isPublished,
        };
        try {
            if (editingVideo) {
                await updateVideo({ id: bootcamp._id, videoId: editingVideo._id, data: payload }).unwrap();
                toast.success('Video updated');
            } else {
                await addVideo({ id: bootcamp._id, data: payload }).unwrap();
                toast.success('Video added');
            }
            setVideoDialogOpen(false);
            setEditingVideo(null);
            setVideoForm(emptyVideo);
        } catch {
            toast.error('Failed to save video');
        }
    };

    const handleDeleteVideo = async () => {
        if (!deleteTarget) return;
        try {
            await deleteVideo({ id: bootcamp._id, videoId: deleteTarget._id }).unwrap();
            toast.success('Video deleted');
            setDeleteTarget(null);
        } catch {
            toast.error('Failed to delete video');
        }
    };

    const videoIdHint =
        videoForm.videoSource === 'youtube'
            ? 'YouTube URL or ID: https://www.youtube.com/watch?v=VIDEO_ID'
            : 'Google Drive URL or ID: https://drive.google.com/file/d/FILE_ID/view';

    return (
        <>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {videos.length} video{videos.length === 1 ? '' : 's'} — stored on the bootcamp
                        itself, fully separate from courses & batches.
                    </p>
                    <Button size="sm" onClick={openAddVideo}>
                        <Plus className="mr-1 h-4 w-4" /> Add video
                    </Button>
                </div>

                {videos.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center">
                        <Video className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No videos added yet.</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {videos.map((v) => (
                            <li
                                key={v._id}
                                className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">{v.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {v.videoSource === 'youtube' ? 'YouTube' : 'Google Drive'}
                                        {v.duration ? ` • ${Math.round(v.duration / 60)} min` : ''}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={v.isPublished ? 'default' : 'outline'}>
                                        {v.isPublished ? 'Published' : 'Draft'}
                                    </Badge>
                                    <Button variant="ghost" size="icon" onClick={() => openEditVideo(v)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setDeleteTarget(v)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingVideo ? 'Edit video' : 'Add video'}</DialogTitle>
                        <DialogDescription>
                            Completed bootcamp session videos, just like course lessons.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={videoForm.title}
                                onChange={(e) => setVideoForm((p) => ({ ...p, title: e.target.value }))}
                                placeholder="Session 1 — Introduction"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                rows={2}
                                value={videoForm.description}
                                onChange={(e) =>
                                    setVideoForm((p) => ({ ...p, description: e.target.value }))
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Video source</label>
                                <select
                                    value={videoForm.videoSource}
                                    onChange={(e) =>
                                        setVideoForm((p) => ({
                                            ...p,
                                            videoSource: e.target.value as 'youtube' | 'googledrive',
                                        }))
                                    }
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="youtube">YouTube</option>
                                    <option value="googledrive">Google Drive</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Duration (minutes)</label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={videoForm.duration}
                                    onChange={(e) =>
                                        setVideoForm((p) => ({ ...p, duration: e.target.value }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Video URL / ID</label>
                            <Input
                                value={videoForm.videoId}
                                onChange={(e) => setVideoForm((p) => ({ ...p, videoId: e.target.value }))}
                                placeholder={videoIdHint}
                            />
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={videoForm.isPublished}
                                onChange={(e) =>
                                    setVideoForm((p) => ({ ...p, isPublished: e.target.checked }))
                                }
                            />
                            Published (visible to buyers)
                        </label>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setVideoDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveVideo} disabled={isAdding || isUpdatingVideo}>
                            {isAdding || isUpdatingVideo ? (
                                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="mr-1 h-4 w-4" />
                            )}
                            {editingVideo ? 'Save changes' : 'Add video'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete video?</DialogTitle>
                        <DialogDescription>
                            {deleteTarget ? `"${deleteTarget.title}" will be removed.` : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteVideo} disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
