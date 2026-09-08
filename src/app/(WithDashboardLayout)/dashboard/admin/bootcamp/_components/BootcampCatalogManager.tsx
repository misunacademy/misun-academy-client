'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Pencil, Plus, Rocket } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useUploadSingleImageMutation } from '@/redux/api/uploadApi';
import type { BootcampCatalogItem } from '@/redux/api/bootcampApi';
import { useGetAllBatchesQuery } from '@/redux/api/batchApi';
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';
import {
    useGetBootcampCatalogAdminQuery,
    usePublishBootcampRecordingMutation,
    useUpdateBootcampMutation,
    useCreateBootcampMutation,
} from '@/redux/api/bootcampApi';

const emptyForm = {
    title: '',
    season: '',
    slug: '',
    tagline: '',
    description: '',
    status: 'upcoming',
    startDate: '',
    endDate: '',
    time: '',
    platform: 'Online (Zoom)',
    liveFee: '350',
    recordedPrice: '499',
    thumbnail: '',
    posterImage: '',
    registrationOpen: true,
};

export default function BootcampCatalogManager() {
    const { data, isLoading, refetch } = useGetBootcampCatalogAdminQuery({ limit: 50 });
    const [publish, { isLoading: isPublishing }] = usePublishBootcampRecordingMutation();
    const [update, { isLoading: isUpdating }] = useUpdateBootcampMutation();
    const [create, { isLoading: isCreating }] = useCreateBootcampMutation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [uploadImage] = useUploadSingleImageMutation();
    const [uploadingField, setUploadingField] = useState<'thumbnail' | 'posterImage' | null>(null);
    const [previews, setPreviews] = useState<{ thumbnail?: string; posterImage?: string }>({});
    const [publishTarget, setPublishTarget] = useState<BootcampCatalogItem | null>(null);
    const [publishSourceBatchId, setPublishSourceBatchId] = useState('');
    const { data: batchesData } = useGetAllBatchesQuery({ limit: 100 });
    const batches = batchesData?.data ?? [];

    const bootcamps = data?.data ?? [];

    const set = (key: keyof typeof emptyForm, value: string | boolean) =>
        setForm((p) => ({ ...p, [key]: value }));

    const toLocalInput = (iso?: string) => {
        if (!iso) return '';
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return '';
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setPreviews({});
        setDialogOpen(true);
    };

    const openEdit = (b: (typeof bootcamps)[number]) => {
        setEditingId(b._id);
        setForm({
            title: b.title ?? '',
            season: b.season ?? '',
            slug: b.slug ?? '',
            tagline: b.tagline ?? '',
            description: b.description ?? '',
            status: b.status ?? 'upcoming',
            startDate: toLocalInput(b.startDate),
            endDate: toLocalInput(b.endDate),
            time: b.time ?? '',
            platform: b.platform ?? 'Online (Zoom)',
            liveFee: String(b.liveFee ?? 0),
            recordedPrice: String(b.recordedPrice ?? 0),
            thumbnail: b.thumbnail ?? '',
            posterImage: b.posterImage ?? '',
            registrationOpen: b.registrationOpen ?? true,
        });
        setPreviews({ thumbnail: b.thumbnail || undefined, posterImage: b.posterImage || undefined });
        setDialogOpen(true);
    };

    const handleImageSelect = (field: 'thumbnail' | 'posterImage', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Invalid file type. Use JPG, PNG, or WEBP.');
            e.target.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File too large. Max size is 5MB.');
            e.target.value = '';
            return;
        }
        const localUrl = URL.createObjectURL(file);
        setPreviews((p) => ({ ...p, [field]: localUrl }));
        void uploadBootcampImage(field, file);
    };

    const uploadBootcampImage = async (field: 'thumbnail' | 'posterImage', file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            setUploadingField(field);
            const result = await uploadImage(formData).unwrap();
            const url = result.data.url;
            setForm((p) => ({ ...p, [field]: url }));
            setPreviews((p) => ({ ...p, [field]: url }));
            toast.success(field === 'thumbnail' ? 'Thumbnail uploaded' : 'Poster uploaded');
        } catch (e: unknown) {
            const err = e as { data?: { message?: string }; message?: string };
            toast.error(err?.data?.message || err?.message || 'Upload failed');
        } finally {
            setUploadingField(null);
        }
    };

    const buildPayload = () => {
        const payload: Record<string, unknown> = {
            title: form.title.trim(),
            season: form.season.trim(),
            status: form.status,
            registrationOpen: form.registrationOpen,
            liveFee: Number(form.liveFee) || 0,
            recordedPrice: Number(form.recordedPrice) || 0,
        };
        if (form.slug.trim()) payload.slug = form.slug.trim();
        if (form.tagline.trim()) payload.tagline = form.tagline.trim();
        if (form.description.trim()) payload.description = form.description.trim();
        if (form.time.trim()) payload.time = form.time.trim();
        if (form.platform.trim()) payload.platform = form.platform.trim();
        if (form.thumbnail.trim()) payload.thumbnail = form.thumbnail.trim();
        if (form.posterImage.trim()) payload.posterImage = form.posterImage.trim();
        if (form.startDate) payload.startDate = new Date(form.startDate).toISOString();
        if (form.endDate) payload.endDate = new Date(form.endDate).toISOString();
        return payload;
    };

    const handleSubmit = async () => {
        if (!form.title.trim() || !form.season.trim()) {
            toast.error('Title and season are required');
            return;
        }
        try {
            if (editingId) {
                await update({ id: editingId, data: buildPayload() as never }).unwrap();
                toast.success('Bootcamp updated');
            } else {
                await create(buildPayload() as never).unwrap();
                toast.success('Bootcamp created');
            }
            setForm(emptyForm);
            setEditingId(null);
            setDialogOpen(false);
            refetch();
        } catch (e) {
            const err = e as { data?: { message?: string } };
            toast.error(err?.data?.message || 'Failed to save bootcamp');
        }
    };

    const handleCreate = handleSubmit;

    const openPublishDialog = (b: BootcampCatalogItem) => {
        setPublishTarget(b);
        setPublishSourceBatchId('');
    };

    const handlePublish = async () => {
        if (!publishTarget) return;
        try {
            await publish({
                id: publishTarget._id,
                sourceBatchId: publishSourceBatchId || undefined,
            }).unwrap();
            toast.success('Recording published — now visible in archive');
            setPublishTarget(null);
            refetch();
        } catch (e) {
            const err = e as { data?: { message?: string } };
            toast.error(err?.data?.message || 'Publish failed');
        }
    };

    const handleStatus = async (id: string, status: string) => {
        try {
            await update({ id, data: { status: status as never } }).unwrap();
            toast.success(`Status → ${status}`);
            refetch();
        } catch {
            toast.error('Status update failed');
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Bootcamp Catalog & Recorded Price
                </CardTitle>
                <div className="flex gap-2">
                    <Button size="sm" onClick={openCreate}>
                        <Plus className="mr-1 h-4 w-4" /> New Bootcamp
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Edit a bootcamp to change its replay price — it syncs to the hidden lifetime batch automatically.
                    Publish to show the card on the /bootcamp archive.
                </p>
                {isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading bootcamps…
                    </div>
                ) : bootcamps.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No bootcamp yet. Click <span className="font-semibold">New Bootcamp</span> above to create Season 3.0.
                    </div>
                ) : (
                    bootcamps.map((b) => (
                        <div key={b._id} className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-1">
                                <p className="font-semibold">
                                    {b.title} <span className="text-muted-foreground">• {b.season}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">/{b.slug} • {b.lessonsCount} videos • {b.durationMinutes} min</p>
                                <div className="flex gap-2">
                                    <Badge variant="outline">{b.status}</Badge>
                                    <Badge variant={b.recordedStatus === 'published' ? 'default' : 'secondary'}>
                                        {b.recordedStatus}
                                    </Badge>
                                    <Badge>৳{b.recordedPrice}</Badge>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => openEdit(b)}>
                                    <Pencil className="mr-1 h-3 w-3" /> Edit
                                </Button>
                                {b.recordedStatus !== 'published' ? (
                                    <Button size="sm" variant="default" onClick={() => openPublishDialog(b)} disabled={isPublishing}>
                                        <Rocket className="mr-1 h-3 w-3" /> Publish
                                    </Button>
                                ) : null}
                                {b.status === 'upcoming' ? (
                                    <Button size="sm" variant="outline" onClick={() => handleStatus(b._id, 'live')}>
                                        Go live
                                    </Button>
                                ) : null}
                                {b.status === 'live' ? (
                                    <Button size="sm" variant="outline" onClick={() => handleStatus(b._id, 'completed')}>
                                        Complete
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) { setEditingId(null); }
            }}>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Bootcamp' : 'New Bootcamp'}</DialogTitle>
                        <DialogDescription>
                            {editingId
                                ? 'Update title, dates, images, fees and status. Slug change must stay unique.'
                                : 'Creates the catalog entry. Slug auto-generates from title + season if left blank.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-title">Title *</label>
                            <Input id="bc-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="প্যারাসিটামল ফর ফটোশপ" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-season">Season *</label>
                            <Input id="bc-season" value={form.season} onChange={(e) => set('season', e.target.value)} placeholder="Season 3.0" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-slug">Slug (optional)</label>
                            <Input id="bc-slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="auto-generated" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-status">Status</label>
                            <select
                                id="bc-status"
                                value={form.status}
                                onChange={(e) => set('status', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="draft">Draft</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium" htmlFor="bc-tagline">Tagline</label>
                            <Input id="bc-tagline" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="৪-দিনের অ্যাডভান্সড গ্রাফিক ডিজাইন বুটক্যাম্প" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium" htmlFor="bc-desc">Description</label>
                            <Textarea id="bc-desc" value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-start">Start date</label>
                            <Input id="bc-start" type="datetime-local" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-end">End date</label>
                            <Input id="bc-end" type="datetime-local" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-time">Time</label>
                            <Input id="bc-time" value={form.time} onChange={(e) => set('time', e.target.value)} placeholder="প্রতিদিন রাত ৯টা" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-platform">Platform</label>
                            <Input id="bc-platform" value={form.platform} onChange={(e) => set('platform', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-livefee">Live fee (৳)</label>
                            <Input id="bc-livefee" type="number" min={0} value={form.liveFee} onChange={(e) => set('liveFee', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-recprice">Recorded price (৳)</label>
                            <Input id="bc-recprice" type="number" min={0} value={form.recordedPrice} onChange={(e) => set('recordedPrice', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-thumb">Thumbnail</label>
                            <Input
                                id="bc-thumb"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                onChange={(e) => handleImageSelect('thumbnail', e)}
                                disabled={uploadingField === 'thumbnail'}
                            />
                            {uploadingField === 'thumbnail' ? (
                                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading…
                                </p>
                            ) : null}
                            {form.thumbnail ? (
                                <p className="break-all text-xs text-muted-foreground">Saved: {form.thumbnail}</p>
                            ) : null}
                            {previews.thumbnail ? (
                                <Image
                                    src={previews.thumbnail}
                                    alt="Thumbnail preview"
                                    width={512}
                                    height={288}
                                    className="h-32 w-full rounded border object-cover"
                                />
                            ) : null}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-poster">Poster</label>
                            <Input
                                id="bc-poster"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                onChange={(e) => handleImageSelect('posterImage', e)}
                                disabled={uploadingField === 'posterImage'}
                            />
                            {uploadingField === 'posterImage' ? (
                                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading…
                                </p>
                            ) : null}
                            {form.posterImage ? (
                                <p className="break-all text-xs text-muted-foreground">Saved: {form.posterImage}</p>
                            ) : null}
                            {previews.posterImage ? (
                                <Image
                                    src={previews.posterImage}
                                    alt="Poster preview"
                                    width={512}
                                    height={288}
                                    className="h-32 w-full rounded border object-cover"
                                />
                            ) : null}
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                            <input
                                id="bc-regopen"
                                type="checkbox"
                                checked={form.registrationOpen}
                                onChange={(e) => set('registrationOpen', e.target.checked)}
                                className="h-4 w-4"
                            />
                            <label className="text-sm font-medium" htmlFor="bc-regopen">Registration open</label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setDialogOpen(false); setEditingId(null); }} disabled={isCreating || isUpdating}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={isCreating || isUpdating || uploadingField !== null}>
                            {isCreating || isUpdating ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : editingId ? <Pencil className="mr-1 h-4 w-4" /> : <Plus className="mr-1 h-4 w-4" />}
                            {editingId ? 'Save changes' : 'Create bootcamp'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={!!publishTarget} onOpenChange={(open) => { if (!open) setPublishTarget(null); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Publish Recording</DialogTitle>
                        <DialogDescription>
                            {publishTarget
                                ? `Publish "${publishTarget.title} ${publishTarget.season}" to the /bootcamp archive.`
                                : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-publish-source">
                                Copy content from batch
                            </label>
                            <select
                                id="bc-publish-source"
                                value={publishSourceBatchId}
                                onChange={(e) => setPublishSourceBatchId(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="">Publish without copying content (empty course)</option>
                                {batches.map((batch) => (
                                    <option key={batch._id} value={batch._id}>
                                        {batch.title} (#{batch.batchNumber})
                                    </option>
                                ))}
                            </select>
                            {batches.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    No batches found — the recording will be published as an empty course.
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPublishTarget(null)} disabled={isPublishing}>
                            Cancel
                        </Button>
                        <Button onClick={handlePublish} disabled={isPublishing}>
                            {isPublishing ? (
                                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            ) : (
                                <Rocket className="mr-1 h-4 w-4" />
                            )}
                            Publish
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
