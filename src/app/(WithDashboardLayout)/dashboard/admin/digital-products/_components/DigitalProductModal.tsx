'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Plus,
    Trash2,
    Loader2,
    Sparkles,
    FileCode,
    FileText,
    Upload,
    CheckCircle2,
    ImageIcon,
    ExternalLink,
    X,
} from 'lucide-react';
import { getApiErrorMessage } from '@/lib/api-helpers';
import {
    DigitalProduct,
    useCreateAdminDigitalProductMutation,
    useUpdateAdminDigitalProductMutation,
    useUploadDigitalProductAssetMutation,
} from '@/redux/api/digitalProductApi';

interface DigitalProductModalProps {
    open: boolean;
    onClose: () => void;
    editingProduct?: DigitalProduct | null;
}

export function DigitalProductModal({
    open,
    onClose,
    editingProduct,
}: DigitalProductModalProps) {
    const [createProduct, { isLoading: isCreating }] = useCreateAdminDigitalProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateAdminDigitalProductMutation();
    const [uploadAsset] = useUploadDigitalProductAssetMutation();

    // File input refs for Cloudinary uploads
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const scriptInputRef = useRef<HTMLInputElement>(null);
    const guideInputRef = useRef<HTMLInputElement>(null);

    // Upload loading states
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
    const [isUploadingScript, setIsUploadingScript] = useState(false);
    const [isUploadingGuide, setIsUploadingGuide] = useState(false);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [tagline, setTagline] = useState('');
    const [description, setDescription] = useState('');
    const [software, setSoftware] = useState<'photoshop' | 'illustrator' | 'bundle' | 'other'>('photoshop');
    const [badge, setBadge] = useState('');
    const [thumbnail, setThumbnail] = useState('');

    const [priceBDT, setPriceBDT] = useState<number>(500);
    const [discountPriceBDT, setDiscountPriceBDT] = useState<number | undefined>(250);
    const [priceINR, setPriceINR] = useState<number>(399);
    const [discountPriceINR, setDiscountPriceINR] = useState<number | undefined>(199);

    const [features, setFeatures] = useState<string[]>(['']);

    const [scriptFileName, setScriptFileName] = useState('');
    const [scriptUrl, setScriptUrl] = useState('');
    const [scriptFileSize, setScriptFileSize] = useState('');

    const [guideFileName, setGuideFileName] = useState('');
    const [guideUrl, setGuideUrl] = useState('');
    const [guideFileSize, setGuideFileSize] = useState('');

    const [isPublished, setIsPublished] = useState(true);

    useEffect(() => {
        if (editingProduct) {
            setTitle(editingProduct.title || '');
            setSlug(editingProduct.slug || '');
            setTagline(editingProduct.tagline || '');
            setDescription(editingProduct.description || '');
            setSoftware(editingProduct.software || 'photoshop');
            setBadge(editingProduct.badge || '');
            setThumbnail(editingProduct.thumbnail || '');
            setPriceBDT(editingProduct.priceBDT ?? 0);
            setDiscountPriceBDT(editingProduct.discountPriceBDT);
            setPriceINR(editingProduct.priceINR ?? 0);
            setDiscountPriceINR(editingProduct.discountPriceINR);
            setFeatures(editingProduct.features?.length ? editingProduct.features : ['']);

            setScriptFileName(editingProduct.scriptFile?.fileName || '');
            setScriptUrl(editingProduct.scriptFile?.url || '');
            setScriptFileSize(editingProduct.scriptFile?.fileSize || '');

            setGuideFileName(editingProduct.guidePdf?.fileName || '');
            setGuideUrl(editingProduct.guidePdf?.url || '');
            setGuideFileSize(editingProduct.guidePdf?.fileSize || '');

            setIsPublished(editingProduct.isPublished ?? true);
        } else {
            setTitle('');
            setSlug('');
            setTagline('');
            setDescription('');
            setSoftware('photoshop');
            setBadge('');
            setThumbnail('');
            setPriceBDT(500);
            setDiscountPriceBDT(250);
            setPriceINR(399);
            setDiscountPriceINR(199);
            setFeatures(['১-ক্লিকে রান করার শর্টকাট স্ক্রিপ্ট', 'স্টেপ-বাই-স্টেপ ইনস্টলেশন গাইড PDF']);
            setScriptFileName('');
            setScriptUrl('');
            setScriptFileSize('');
            setGuideFileName('');
            setGuideUrl('');
            setGuideFileSize('');
            setIsPublished(true);
        }
    }, [editingProduct, open]);

    // Handle Cloudinary Thumbnail Upload
    const handleThumbnailFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploadingThumbnail(true);
            const formData = new FormData();
            formData.append('file', file);
            const res = await uploadAsset(formData).unwrap();
            if (res.data?.url) {
                setThumbnail(res.data.url);
                toast.success('Thumbnail uploaded to Cloudinary successfully!');
            }
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'Failed to upload thumbnail'));
        } finally {
            setIsUploadingThumbnail(false);
            e.target.value = '';
        }
    };

    // Handle Cloudinary Script File Upload
    const handleScriptFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploadingScript(true);
            const formData = new FormData();
            formData.append('file', file);
            const res = await uploadAsset(formData).unwrap();
            if (res.data?.url) {
                setScriptFileName(res.data.fileName || file.name);
                setScriptUrl(res.data.url);
                setScriptFileSize(res.data.fileSize || '');
                toast.success('Script code file uploaded to Cloudinary successfully!');
            }
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'Failed to upload script file'));
        } finally {
            setIsUploadingScript(false);
            e.target.value = '';
        }
    };

    // Handle Cloudinary Guide PDF Upload
    const handleGuideFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploadingGuide(true);
            const formData = new FormData();
            formData.append('file', file);
            const res = await uploadAsset(formData).unwrap();
            if (res.data?.url) {
                setGuideFileName(res.data.fileName || file.name);
                setGuideUrl(res.data.url);
                setGuideFileSize(res.data.fileSize || '');
                toast.success('Instruction PDF uploaded to Cloudinary successfully!');
            }
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'Failed to upload instruction PDF'));
        } finally {
            setIsUploadingGuide(false);
            e.target.value = '';
        }
    };

    const handleFeatureChange = (index: number, val: string) => {
        const next = [...features];
        next[index] = val;
        setFeatures(next);
    };

    const handleAddFeature = () => {
        setFeatures([...features, '']);
    };

    const handleRemoveFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    // Auto-generate slug from title
    const handleTitleChange = (val: string) => {
        setTitle(val);
        if (!editingProduct) {
            const cleanSlug = val
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            setSlug(cleanSlug);
        }
    };

    const handleSubmit = async (e?: React.FormEvent, explicitPublishStatus?: boolean) => {
        if (e) e.preventDefault();

        const targetIsPublished = explicitPublishStatus !== undefined ? explicitPublishStatus : isPublished;

        if (!title.trim()) {
            toast.error('Please enter product title');
            return;
        }

        // For published products, ensure mandatory files are uploaded
        if (targetIsPublished) {
            if (!scriptUrl.trim()) {
                toast.error('Please upload the script code file before publishing');
                return;
            }

            if (!guideUrl.trim()) {
                toast.error('Please upload the instruction guide PDF before publishing');
                return;
            }
        }

        // Auto-generate fallback slug if cleanSlug was empty (e.g. Pure Bengali title)
        let finalSlug = slug.trim();
        if (!finalSlug) {
            finalSlug = `${software}-script-${Date.now().toString(36)}`;
        }

        const payload: any = {
            title: title.trim(),
            slug: finalSlug,
            tagline: tagline.trim(),
            description: description.trim(),
            software,
            badge: badge.trim(),
            thumbnail: thumbnail.trim(),
            priceBDT: Number(priceBDT) || 0,
            discountPriceBDT: discountPriceBDT !== undefined && discountPriceBDT !== null && (discountPriceBDT as any) !== '' ? Number(discountPriceBDT) : undefined,
            priceINR: Number(priceINR) || 0,
            discountPriceINR: discountPriceINR !== undefined && discountPriceINR !== null && (discountPriceINR as any) !== '' ? Number(discountPriceINR) : undefined,
            features: features.filter((f) => f.trim().length > 0),
            isPublished: targetIsPublished,
            status: targetIsPublished ? 'published' : 'draft',
        };

        if (scriptUrl.trim()) {
            payload.scriptFile = {
                fileName: scriptFileName.trim() || 'script-file',
                url: scriptUrl.trim(),
                fileSize: scriptFileSize.trim() || undefined,
            };
        }

        if (guideUrl.trim()) {
            payload.guidePdf = {
                fileName: guideFileName.trim() || 'guide.pdf',
                url: guideUrl.trim(),
                fileSize: guideFileSize.trim() || undefined,
            };
        }

        try {
            if (editingProduct) {
                await updateProduct({ id: editingProduct._id, data: payload }).unwrap();
                toast.success(targetIsPublished ? 'Digital product updated & published successfully' : 'Draft saved successfully');
            } else {
                await createProduct(payload).unwrap();
                toast.success(targetIsPublished ? 'Digital product created & published successfully' : 'Draft product saved successfully');
            }
            onClose();
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'Failed to save product'));
        }
    };

    const isSaving = isCreating || isUpdating;

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-white text-gray-900 border-gray-200 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-gray-900">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        {editingProduct ? 'Edit Digital Product' : 'Add New Digital Product'}
                    </DialogTitle>
                </DialogHeader>

                {/* Hidden File Inputs for Cloudinary Uploads */}
                <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={handleThumbnailFileSelect}
                />
                <input
                    ref={scriptInputRef}
                    type="file"
                    accept=".jsx,.js,.zip,.rar,.txt,.json"
                    className="hidden"
                    onChange={handleScriptFileSelect}
                />
                <input
                    ref={guideInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleGuideFileSelect}
                />

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    {/* General Info */}
                    <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                        <h4 className="text-sm font-semibold text-gray-900">Basic Information</h4>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-medium text-gray-700">Product Title *</label>
                                <Input
                                    value={title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="e.g. Photoshop Super Retouch Shortcut Script"
                                    required
                                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-700">Software Type</label>
                                <select
                                    value={software}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                        setSoftware(e.target.value as 'photoshop' | 'illustrator' | 'bundle' | 'other')
                                    }
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="photoshop">Photoshop</option>
                                    <option value="illustrator">Illustrator</option>
                                    <option value="bundle">Combo Bundle (Ps + Ai)</option>
                                    <option value="other">Other Software</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-700">Badge (Optional)</label>
                                <Input
                                    value={badge}
                                    onChange={(e) => setBadge(e.target.value)}
                                    placeholder="Bestseller / New / Save 55%"
                                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                                />
                            </div>

                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-medium text-gray-700">Tagline / Subtitle</label>
                                <Input
                                    value={tagline}
                                    onChange={(e) => setTagline(e.target.value)}
                                    placeholder="Speed up your design and retouching workflow 5x in one click!"
                                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                                />
                            </div>

                            {/* Thumbnail (Direct Cloudinary Upload Only - No manual URL input) */}
                            <div className="space-y-2 sm:col-span-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                        <ImageIcon className="h-4 w-4 text-emerald-600" />
                                        Product Thumbnail (Cloudinary)
                                    </label>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => thumbnailInputRef.current?.click()}
                                        disabled={isUploadingThumbnail}
                                        className="h-8 border-emerald-300 bg-emerald-50 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                                    >
                                        {isUploadingThumbnail ? (
                                            <>
                                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin text-emerald-700" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-1.5 h-3.5 w-3.5 text-emerald-700" />
                                                {thumbnail ? 'Change Image' : 'Upload Image'}
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {thumbnail ? (
                                    <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-2.5">
                                        <div className="relative h-14 w-14 overflow-hidden rounded-md border border-gray-200 bg-gray-100 shrink-0">
                                            <Image
                                                src={thumbnail}
                                                alt="Thumbnail preview"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1 text-xs font-bold text-emerald-800">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Uploaded to Cloudinary
                                            </div>
                                            <p className="text-[11px] text-gray-500 font-mono truncate">Cloudinary Image Hosted</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setThumbnail('')}
                                            className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                                            title="Remove Image"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => thumbnailInputRef.current?.click()}
                                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-4 transition hover:bg-gray-50 text-center"
                                    >
                                        <ImageIcon className="h-6 w-6 text-gray-400 mb-1" />
                                        <span className="text-xs text-gray-600">
                                            Click here to upload product thumbnail image
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-medium text-gray-700">Detailed Description</label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder="Write a detailed description of the product and its usage..."
                                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dual Currency Pricing */}
                    <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                        <h4 className="text-sm font-semibold text-gray-900">
                            Pricing (Bangladesh & India)
                        </h4>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 rounded-lg border border-emerald-200 bg-emerald-50/40 p-3">
                                <span className="text-xs font-bold text-emerald-800">🇧🇩 Bangladesh (BDT ৳)</span>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-[11px] font-medium text-gray-600">Regular Price (৳)</label>
                                        <Input
                                            type="number"
                                            value={priceBDT}
                                            onChange={(e) => setPriceBDT(Number(e.target.value))}
                                            required
                                            className="bg-white border-gray-300 text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-medium text-gray-600">Discounted Price (৳)</label>
                                        <Input
                                            type="number"
                                            value={discountPriceBDT ?? ''}
                                            onChange={(e) =>
                                                setDiscountPriceBDT(e.target.value ? Number(e.target.value) : undefined)
                                            }
                                            placeholder="Leave empty if no discount"
                                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50/40 p-3">
                                <span className="text-xs font-bold text-amber-800">
                                    🇮🇳 India / PhonePe (INR ₹)
                                </span>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-[11px] font-medium text-gray-600">Regular Price (₹)</label>
                                        <Input
                                            type="number"
                                            value={priceINR}
                                            onChange={(e) => setPriceINR(Number(e.target.value))}
                                            required
                                            className="bg-white border-gray-300 text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-medium text-gray-600">Discounted Price (₹)</label>
                                        <Input
                                            type="number"
                                            value={discountPriceINR ?? ''}
                                            onChange={(e) =>
                                                setDiscountPriceINR(e.target.value ? Number(e.target.value) : undefined)
                                            }
                                            placeholder="Leave empty if no discount"
                                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-gray-900">
                                Key Features & Highlights
                            </h4>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddFeature}
                                className="h-8 border-gray-300 bg-white text-xs text-gray-700 hover:bg-gray-100"
                            >
                                <Plus className="mr-1 h-3.5 w-3.5" /> Add Feature
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {features.map((feat, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <Input
                                        value={feat}
                                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                                        placeholder={`Feature ${idx + 1}`}
                                        className="bg-white border-gray-300 text-gray-900 text-sm"
                                    />
                                    {features.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveFeature(idx)}
                                            className="h-9 w-9 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Downloadable Files: Script & Instruction PDF (Direct Cloudinary Upload Only - No manual URL input) */}
                    <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                        <h4 className="text-sm font-semibold text-gray-900">
                            Downloadable Assets (Cloudinary)
                        </h4>
                        <div className="space-y-4">
                            {/* Script File */}
                            <div className="rounded-lg border border-amber-200 bg-white p-3.5 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                                        <FileCode className="h-4 w-4 text-amber-600" />
                                        1. Script Code File (.jsx / .zip / .js) *
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => scriptInputRef.current?.click()}
                                        disabled={isUploadingScript}
                                        className="h-8 border-amber-300 bg-amber-50 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                                    >
                                        {isUploadingScript ? (
                                            <>
                                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin text-amber-700" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-1.5 h-3.5 w-3.5 text-amber-700" />
                                                {scriptUrl ? 'Change File' : 'Upload Script File'}
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {scriptUrl ? (
                                    <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/60 p-2.5 text-xs">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                                            <div className="min-w-0">
                                                <div className="font-bold text-amber-900 truncate">
                                                    {scriptFileName || 'Script File'}
                                                </div>
                                                <div className="text-[11px] text-gray-600 font-mono">
                                                    {scriptFileSize ? `Size: ${scriptFileSize} • ` : ''}
                                                    Hosted on Cloudinary
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <a
                                                href={scriptUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:underline"
                                            >
                                                Preview Link <ExternalLink className="h-3 w-3" />
                                            </a>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setScriptUrl('');
                                                    setScriptFileName('');
                                                    setScriptFileSize('');
                                                }}
                                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                                title="Remove File"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => scriptInputRef.current?.click()}
                                        className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-amber-200 bg-amber-50/30 p-3.5 text-center transition hover:bg-amber-50/70"
                                    >
                                        <span className="text-xs text-amber-900 font-medium">
                                            Click here to select .jsx, .js or .zip script file (direct Cloudinary upload)
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <label className="text-[11px] font-medium text-gray-600">
                                        Custom File Name (Optional)
                                    </label>
                                    <Input
                                        value={scriptFileName}
                                        onChange={(e) => setScriptFileName(e.target.value)}
                                        placeholder="e.g. Photoshop-Shortcuts.jsx"
                                        className="bg-white border-gray-300 text-gray-900 text-xs mt-1"
                                    />
                                </div>
                            </div>

                            {/* Instruction Guide PDF */}
                            <div className="rounded-lg border border-blue-200 bg-white p-3.5 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        2. Instruction Guide (PDF) *
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => guideInputRef.current?.click()}
                                        disabled={isUploadingGuide}
                                        className="h-8 border-blue-300 bg-blue-50 text-xs font-semibold text-blue-900 hover:bg-blue-100"
                                    >
                                        {isUploadingGuide ? (
                                            <>
                                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin text-blue-700" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-1.5 h-3.5 w-3.5 text-blue-700" />
                                                {guideUrl ? 'Change PDF' : 'Upload Guide PDF'}
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {guideUrl ? (
                                    <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/60 p-2.5 text-xs">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                                            <div className="min-w-0">
                                                <div className="font-bold text-blue-900 truncate">
                                                    {guideFileName || 'Installation-Guide.pdf'}
                                                </div>
                                                <div className="text-[11px] text-gray-600 font-mono">
                                                    {guideFileSize ? `Size: ${guideFileSize} • ` : ''}
                                                    Hosted on Cloudinary
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <a
                                                href={guideUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 hover:underline"
                                            >
                                                Preview Link <ExternalLink className="h-3 w-3" />
                                            </a>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setGuideUrl('');
                                                    setGuideFileName('');
                                                    setGuideFileSize('');
                                                }}
                                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                                title="Remove File"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => guideInputRef.current?.click()}
                                        className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/30 p-3.5 text-center transition hover:bg-blue-50/70"
                                    >
                                        <span className="text-xs text-blue-900 font-medium">
                                            Click here to select instruction .pdf file (direct Cloudinary upload)
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <label className="text-[11px] font-medium text-gray-600">
                                        Custom File Name (Optional)
                                    </label>
                                    <Input
                                        value={guideFileName}
                                        onChange={(e) => setGuideFileName(e.target.value)}
                                        placeholder="e.g. Installation-Guide.pdf"
                                        className="bg-white border-gray-300 text-gray-900 text-xs mt-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Visibility */}
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold text-gray-900 block">
                                    Publication Status
                                </label>
                                <span
                                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                        isPublished
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                                    }`}
                                >
                                    {isPublished ? 'Published (Live)' : 'Draft (Unpublished)'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {isPublished
                                    ? 'Published products are visible and purchasable by students on the storefront. All files required.'
                                    : 'Draft mode allows saving partial information without downloadable files.'}
                            </p>
                        </div>
                        <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                    </div>

                    <DialogFooter className="gap-2 pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSaving}
                            className="border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleSubmit(undefined, false)}
                            disabled={isSaving || isUploadingThumbnail || isUploadingScript || isUploadingGuide}
                            variant="secondary"
                            className="border border-amber-300 bg-amber-50 font-bold text-amber-900 hover:bg-amber-100 shadow-sm"
                        >
                            {isSaving && !isPublished && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save as Draft
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleSubmit(undefined, true)}
                            disabled={isSaving || isUploadingThumbnail || isUploadingScript || isUploadingGuide}
                            className="bg-[#ffd60a] font-bold text-black hover:bg-[#ffd60a]/90 shadow-sm"
                        >
                            {isSaving && isPublished && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingProduct ? 'Update & Publish' : 'Publish Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
