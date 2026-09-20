'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Pencil, Plus, Rocket, Video } from 'lucide-react';
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
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';
import BootcampVideosManager from './BootcampVideosManager';
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
    mentorName: '',
    mentorTitle: '',
    mentorBio: '',
    mentorImage: '',
    guaranteeNote: '',
    audience: '',
    perksJson: '',
    scheduleJson: '',
    faqJson: '',
    painPointsJson: '',
    outcomesJson: '',
    testimonialsJson: '',
};

const stringifyList = (v: unknown) => {
    if (!v || (Array.isArray(v) && v.length === 0)) return '';
    try {
        return JSON.stringify(v, null, 2);
    } catch {
        return '';
    }
};

const parseJsonArray = (raw: string, label: string): unknown[] | undefined => {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;
    try {
        const parsed: unknown = JSON.parse(trimmed);
        if (!Array.isArray(parsed)) throw new Error('not-array');
        return parsed;
    } catch {
        throw new Error(`${label} must be a valid JSON array`);
    }
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
    const [videosTarget, setVideosTarget] = useState<BootcampCatalogItem | null>(null);

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
            mentorName: b.mentor?.name ?? '',
            mentorTitle: b.mentor?.title ?? '',
            mentorBio: b.mentor?.bio ?? '',
            mentorImage: b.mentor?.image ?? '',
            guaranteeNote: b.guaranteeNote ?? '',
            audience: (b.audience ?? []).join('\n'),
            perksJson: stringifyList(b.perks),
            scheduleJson: stringifyList(b.schedule),
            faqJson: stringifyList(b.faq),
            painPointsJson: stringifyList(b.painPoints),
            outcomesJson: stringifyList(b.outcomes),
            testimonialsJson: stringifyList(b.testimonials),
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
        if (form.guaranteeNote.trim()) payload.guaranteeNote = form.guaranteeNote.trim();
        const audienceLines = form.audience
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);
        if (audienceLines.length > 0) payload.audience = audienceLines;
        if (form.mentorName.trim()) {
            payload.mentor = {
                name: form.mentorName.trim(),
                ...(form.mentorTitle.trim() ? { title: form.mentorTitle.trim() } : {}),
                ...(form.mentorBio.trim() ? { bio: form.mentorBio.trim() } : {}),
                ...(form.mentorImage.trim() ? { image: form.mentorImage.trim() } : {}),
            };
        }
        const jsonFields: [string, string, string][] = [
            ['perksJson', 'perks', 'Perks'],
            ['scheduleJson', 'schedule', 'Schedule'],
            ['faqJson', 'faq', 'FAQ'],
            ['painPointsJson', 'painPoints', 'Pain points'],
            ['outcomesJson', 'outcomes', 'Outcomes'],
            ['testimonialsJson', 'testimonials', 'Testimonials'],
        ];
        for (const [formKey, payloadKey, label] of jsonFields) {
            const parsed = parseJsonArray(form[formKey as keyof typeof form] as string, label);
            if (parsed !== undefined) payload[payloadKey] = parsed;
        }
        return payload;
    };

    const handleSubmit = async () => {
        if (!form.title.trim() || !form.season.trim()) {
            toast.error('Title and season are required');
            return;
        }
        let payload: Record<string, unknown>;
        try {
            payload = buildPayload();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Invalid JSON in detail fields');
            return;
        }
        try {
            if (editingId) {
                await update({ id: editingId, data: payload as never }).unwrap();
                toast.success('Bootcamp updated');
            } else {
                await create(payload as never).unwrap();
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

    const handlePublish = async (b: BootcampCatalogItem) => {
        try {
            await publish({ id: b._id }).unwrap();
            toast.success('Recording published — now visible in archive');
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
                    Bootcamps are fully standalone — add completed session videos directly (no course
                    or batch needed), then publish to show the card on the /bootcamp archive.
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
                                <Button size="sm" variant="outline" onClick={() => setVideosTarget(b)}>
                                    <Video className="mr-1 h-3 w-3" /> Videos ({b.videos?.length ?? 0})
                                </Button>
                                {b.recordedStatus !== 'published' ? (
                                    <Button size="sm" variant="default" onClick={() => handlePublish(b)} disabled={isPublishing}>
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
                        <div className="space-y-2 sm:col-span-2">
                            <p className="text-sm font-semibold">Detail page sections (optional)</p>
                            <p className="text-xs text-muted-foreground">List fields accept a JSON array, leave blank to hide.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-mentor-name">Mentor name</label>
                            <Input id="bc-mentor-name" value={form.mentorName} onChange={(e) => set('mentorName', e.target.value)} placeholder="Mentor name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-mentor-title">Mentor title</label>
                            <Input id="bc-mentor-title" value={form.mentorTitle} onChange={(e) => set('mentorTitle', e.target.value)} placeholder="Senior Designer, ..." />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium" htmlFor="bc-mentor-bio">Mentor bio</label>
                            <Textarea id="bc-mentor-bio" value={form.mentorBio} onChange={(e) => set('mentorBio', e.target.value)} rows={2} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-mentor-image">Mentor image URL</label>
                            <Input id="bc-mentor-image" value={form.mentorImage} onChange={(e) => set('mentorImage', e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="bc-audience">Who is this for (one per line)</label>
                            <Textarea id="bc-audience" value={form.audience} onChange={(e) => set('audience', e.target.value)} rows={3} placeholder={'Beginners\nFreelancers'} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium" htmlFor="bc-guarantee">Guarantee / support note</label>
                            <Textarea id="bc-guarantee" value={form.guaranteeNote} onChange={(e) => set('guaranteeNote', e.target.value)} rows={2} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium" htmlFor="bc-perks">Perks JSON</label>
                            <Textarea id="bc-perks" value={form.perksJson} onChange={(e) => set('perksJson', e.target.value)} rows={3} placeholder='[{"title":"...","description":"..."}]' className="font-mono text-xs" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium" htmlFor="bc-schedule">Schedule / curriculum JSON</label>
                            <Textarea id="bc-schedule" value={form.scheduleJson} onChange={(e) => set('scheduleJson', e.target.value)} rows={3} placeholder='[{"day":"Day 1","title":"...","description":"..."}]' className="font-mono text-xs" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium" htmlFor="bc-faq">FAQ JSON</label>
                            <Textarea id="bc-faq" value={form.faqJson} onChange={(e) => set('faqJson', e.target.value)} rows={3} placeholder='[{"question":"...","answer":"..."}]' className="font-mono text-xs" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium" htmlFor="bc-pain">Pain points JSON (Is this you?)</label>
                            <Textarea id="bc-pain" value={form.painPointsJson} onChange={(e) => set('painPointsJson', e.target.value)} rows={3} placeholder='[{"title":"...","description":"..."}]' className="font-mono text-xs" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium" htmlFor="bc-outcomes">Outcomes JSON (what you will be able to do)</label>
                            <Textarea id="bc-outcomes" value={form.outcomesJson} onChange={(e) => set('outcomesJson', e.target.value)} rows={3} placeholder='[{"title":"...","description":"..."}]' className="font-mono text-xs" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium" htmlFor="bc-testimonials">Testimonials JSON</label>
                            <Textarea id="bc-testimonials" value={form.testimonialsJson} onChange={(e) => set('testimonialsJson', e.target.value)} rows={3} placeholder='[{"name":"...","role":"...","quote":"...","rating":5}]' className="font-mono text-xs" />
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
            <Dialog open={!!videosTarget} onOpenChange={(open) => { if (!open) setVideosTarget(null); }}>
                <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {videosTarget ? `${videosTarget.title} ${videosTarget.season} — Videos` : ''}
                        </DialogTitle>
                        <DialogDescription>
                            Add the completed bootcamp videos here. They live on the bootcamp —
                            completely separate from courses, batches and recordings.
                        </DialogDescription>
                    </DialogHeader>
                    {videosTarget ? (
                        <BootcampVideosManager bootcamp={videosTarget} />
                    ) : null}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setVideosTarget(null)}>
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
