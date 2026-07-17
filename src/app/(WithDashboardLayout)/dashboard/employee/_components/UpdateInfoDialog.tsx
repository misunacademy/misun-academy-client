'use client';

import Image from 'next/image';
import { useState, useCallback, useRef } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useUploadSingleImageMutation } from '@/redux/api/uploadApi';
import { useUpdateMyEmployeeProfileMutation } from '@/redux/api/employeeApi';
import { toast } from 'sonner';
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import {
    User, Mail, Phone, MapPin, Droplets, IdCard, CalendarDays, Briefcase, PencilRuler,
    Loader2, Pencil, Save, X, Upload, ImagePlus, Trash2, CheckCircle2, AlertCircle,
} from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const updateInfoSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().optional().default(''),
    address: z.string().optional().default(''),
    bloodGroup: z.string().optional().default(''),
    nidNumber: z.string().optional().default(''),
    whatsapp: z.string().optional().default(''),
    dateOfBirth: z.string().optional().default(''),
    tshirtSize: z.string().optional().default(''),
    designation: z.string().optional().default(''),
});

type UpdateInfoFormValues = z.infer<typeof updateInfoSchema>;

function FieldSection({ title, icon: Icon }: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
}) {
    return (
        <div className="flex items-center gap-2 pt-5 pb-1 border-t border-gray-100 first:border-0 first:pt-0">
            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {title}
            </span>
        </div>
    );
}

function FieldWrapper({ id, label, children, hint }: {
    id: string;
    label: string;
    children: React.ReactNode;
    hint?: string;
}) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label}
            </Label>
            {children}
            {hint && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
    );
}

interface NidUploadZoneProps {
    label: string;
    inputId: string;
    currentUrl?: string | null;
    localFile: File | null;
    localPreview: string | null;
    isUploading: boolean;
    isDragging: boolean;
    onFileSelect: (file: File) => void;
    onClear: () => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}

function NidUploadZone({
    label, inputId, currentUrl, localFile, localPreview, isUploading, isDragging,
    onFileSelect, onClear, onDragEnter, onDragLeave, onDrop,
}: NidUploadZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
        if (inputRef.current) inputRef.current.value = '';
    };
    const displayUrl = localPreview ?? currentUrl;
    const hasImage = !!displayUrl;
    const isNew = !!localFile;

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">{label}</Label>
            <div
                role="button"
                tabIndex={0}
                aria-label={`Upload ${label}`}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => !hasImage && inputRef.current?.click()}
                onKeyDown={(e) => !hasImage && e.key === 'Enter' && inputRef.current?.click()}
                className={`
                    relative rounded-xl border-2 transition-all duration-200 overflow-hidden
                    ${isDragging
                        ? 'border-emerald-400 bg-emerald-50 scale-[1.01]'
                        : hasImage
                            ? 'border-emerald-200 bg-transparent cursor-default'
                            : 'border-dashed border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/40 cursor-pointer'
                    }
                `}
            >
                {hasImage ? (
                    <div className="relative w-full h-40 group">
                        <Image src={displayUrl!} alt={`${label} preview`} fill sizes="400px" className="object-cover" unoptimized />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow transition-colors"
                            >
                                <ImagePlus className="w-3.5 h-3.5" /> Change
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onClear(); }}
                                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg shadow transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                        </div>
                        {isUploading && (
                            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-white/90 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full shadow">
                                <Loader2 className="w-3 h-3 animate-spin text-emerald-500" /> Uploading…
                            </div>
                        )}
                        {isNew && !isUploading && (
                            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-2.5 py-1 rounded-full shadow">
                                <AlertCircle className="w-3 h-3" /> New — save to upload
                            </div>
                        )}
                        {!isNew && !isUploading && (
                            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2.5 py-1 rounded-full shadow">
                                <CheckCircle2 className="w-3 h-3" /> Uploaded
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 py-8 px-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${isDragging ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                            <Upload className={`w-6 h-6 transition-colors ${isDragging ? 'text-emerald-500' : 'text-gray-400'}`} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-gray-600">
                                {isDragging ? `Drop your ${label} here` : `Upload ${label}`}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Drag & drop, or <span className="text-emerald-600 font-medium underline">browse</span>
                            </p>
                            <p className="text-xs text-gray-300 mt-1">PNG, JPG, WEBP · max 5 MB</p>
                        </div>
                    </div>
                )}
            </div>
            <input ref={inputRef} id={inputId} type="file" accept="image/png,image/jpeg,image/webp,image/jpg" className="hidden" onChange={handleChange} />
        </div>
    );
}

export interface EmployeeExtendedInfo {
    name: string;
    phone: string;
    address: string;
    bloodGroup: string;
    nidNumber: string;
    whatsapp: string;
    dateOfBirth: string;
    tshirtSize: string;
    designation: string;
    nidPhotoFrontUrl?: string | null;
    nidPhotoBackUrl?: string | null;
}

interface Props {
    open: boolean;
    onClose: () => void;
    current: EmployeeExtendedInfo;
    onSaved: (updated: EmployeeExtendedInfo) => void;
}

export function UpdateInfoDialog({ open, onClose, current, onSaved }: Props) {
    const { updateUserProfile } = useAuth();
    const [uploadImage] = useUploadSingleImageMutation();
    const [updateProfile] = useUpdateMyEmployeeProfileMutation();

    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragTarget, setDragTarget] = useState<'front' | 'back' | null>(null);
    const [uploadingSide, setUploadingSide] = useState<'front' | 'back' | null>(null);

    const [nidFrontFile, setNidFrontFile] = useState<File | null>(null);
    const [nidFrontPreview, setNidFrontPreview] = useState<string | null>(null);
    const [nidFrontCleared, setNidFrontCleared] = useState(false);

    const [nidBackFile, setNidBackFile] = useState<File | null>(null);
    const [nidBackPreview, setNidBackPreview] = useState<string | null>(null);
    const [nidBackCleared, setNidBackCleared] = useState(false);

    const form = useForm<UpdateInfoFormValues>({
        resolver: zodResolver(updateInfoSchema) as Resolver<UpdateInfoFormValues>,
        defaultValues: {
            name: current.name || '',
            phone: current.phone || '',
            address: current.address || '',
            bloodGroup: current.bloodGroup || '',
            nidNumber: current.nidNumber || '',
            whatsapp: current.whatsapp || '',
            dateOfBirth: current.dateOfBirth || '',
            tshirtSize: current.tshirtSize || '',
            designation: current.designation || '',
        },
    });

    const applyFile = useCallback((file: File, side: 'front' | 'back') => {
        if (file.size > MAX_FILE_BYTES) {
            toast.error('File is too large. Maximum size is 5 MB.');
            return;
        }
        if (!file.type.startsWith('image/')) {
            toast.error('Only image files are allowed.');
            return;
        }
        const url = URL.createObjectURL(file);
        if (side === 'front') {
            setNidFrontFile(file);
            setNidFrontCleared(false);
            setNidFrontPreview(url);
            return;
        }
        setNidBackFile(file);
        setNidBackCleared(false);
        setNidBackPreview(url);
    }, []);

    const clearNidPhoto = (side: 'front' | 'back') => {
        if (side === 'front') {
            setNidFrontFile(null);
            if (nidFrontPreview) URL.revokeObjectURL(nidFrontPreview);
            setNidFrontPreview(null);
            setNidFrontCleared(true);
            return;
        }
        setNidBackFile(null);
        if (nidBackPreview) URL.revokeObjectURL(nidBackPreview);
        setNidBackPreview(null);
        setNidBackCleared(true);
    };

    const onDragEnter = (side: 'front' | 'back') => (e: React.DragEvent) => {
        e.preventDefault();
        setDragTarget(side);
    };
    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragTarget(null);
    };
    const onDrop = (side: 'front' | 'back') => (e: React.DragEvent) => {
        e.preventDefault();
        setDragTarget(null);
        const file = e.dataTransfer.files?.[0];
        if (file) applyFile(file, side);
    };

    const handleSubmit = async (values: UpdateInfoFormValues) => {
        setSaving(true);
        try {
            let resolvedFrontUrl: string | null | undefined = current.nidPhotoFrontUrl;
            let resolvedBackUrl: string | null | undefined = current.nidPhotoBackUrl;

            if (nidFrontFile || nidBackFile) setUploading(true);

            if (nidFrontFile) {
                setUploadingSide('front');
                const fd = new FormData();
                fd.append('image', nidFrontFile);
                const res = await uploadImage(fd).unwrap();
                resolvedFrontUrl = res.data.url;
            } else if (nidFrontCleared) {
                resolvedFrontUrl = null;
            }

            if (nidBackFile) {
                setUploadingSide('back');
                const fd = new FormData();
                fd.append('image', nidBackFile);
                const res = await uploadImage(fd).unwrap();
                resolvedBackUrl = res.data.url;
            } else if (nidBackCleared) {
                resolvedBackUrl = null;
            }

            setUploadingSide(null);
            setUploading(false);

            const authPayload: Record<string, unknown> = {};
            if (values.name.trim() !== current.name) authPayload.name = values.name.trim();
            if (values.phone.trim() !== current.phone) authPayload.phone = values.phone.trim();
            if (values.address.trim() !== current.address) authPayload.address = values.address.trim();

            if (Object.keys(authPayload).length > 0) {
                const result = await updateUserProfile(authPayload);
                if (!result.success) {
                    toast.error(result.error ?? 'Failed to update profile');
                    setSaving(false);
                    return;
                }
            }

            await updateProfile({
                name: values.name.trim(),
                phone: values.phone.trim(),
                address: values.address.trim(),
                whatsapp: values.whatsapp.trim(),
                bloodGroup: values.bloodGroup,
                nidNumber: values.nidNumber.trim(),
                dateOfBirth: values.dateOfBirth || null,
                tshirtSize: values.tshirtSize.trim() || null,
                designation: values.designation.trim() || null,
                nidPhotoFrontUrl: resolvedFrontUrl,
                nidPhotoBackUrl: resolvedBackUrl,
            }).unwrap();

            onSaved({
                ...values,
                nidPhotoFrontUrl: resolvedFrontUrl ?? null,
                nidPhotoBackUrl: resolvedBackUrl ?? null,
            });
            toast.success('Profile updated successfully!');
            onClose();
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setUploadingSide(null);
            setUploading(false);
            setSaving(false);
        }
    };

    const isBusy = saving || uploading;

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => {
            if (nextOpen) {
                form.reset({
                    name: current.name || '',
                    phone: current.phone || '',
                    address: current.address || '',
                    bloodGroup: current.bloodGroup || '',
                    nidNumber: current.nidNumber || '',
                    whatsapp: current.whatsapp || '',
                    dateOfBirth: current.dateOfBirth || '',
                    tshirtSize: current.tshirtSize || '',
                    designation: current.designation || '',
                });
                if (nidFrontPreview) URL.revokeObjectURL(nidFrontPreview);
                if (nidBackPreview) URL.revokeObjectURL(nidBackPreview);
                setNidFrontFile(null); setNidFrontPreview(null); setNidFrontCleared(false);
                setNidBackFile(null); setNidBackPreview(null); setNidBackCleared(false);
                setDragTarget(null); setUploadingSide(null);
            }
            if (!nextOpen) onClose();
        }}>
            <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-0 gap-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-emerald-50 to-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                            <Pencil className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-gray-800">Update Information</DialogTitle>
                            <DialogDescription className="text-xs text-gray-500 mt-0.5">
                                Edit your personal details, contact info, and NID.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 py-5 space-y-4">
                        <FieldSection title="Personal Details" icon={User} />

                        <FieldWrapper id="upd-name" label="Full Name" hint="Your display name across the platform.">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <FormControl>
                                                <Input id="upd-name" className="pl-9" {...field} placeholder="Full name" disabled={isBusy} />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper id="upd-email" label="Email Address" hint="Email cannot be changed here.">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <Input
                                    id="upd-email"
                                    className="pl-9 bg-gray-50 text-gray-400 cursor-not-allowed"
                                    value={current.name}
                                    readOnly
                                    disabled
                                    tabIndex={-1}
                                />
                            </div>
                        </FieldWrapper>

                        <FieldWrapper id="upd-dob" label="Date of Birth">
                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative">
                                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <FormControl>
                                                <Input id="upd-dob" type="date" className="pl-9" {...field} disabled={isBusy} />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper id="upd-designation" label="Designation" hint="Your current role or title.">
                            <FormField
                                control={form.control}
                                name="designation"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <FormControl>
                                                <Input id="upd-designation" className="pl-9" {...field} placeholder="e.g., Senior Designer" disabled={isBusy} />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper id="upd-tshirt" label="T-shirt Size">
                            <FormField
                                control={form.control}
                                name="tshirtSize"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative">
                                            <PencilRuler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                                            <Select onValueChange={field.onChange} value={field.value || undefined} disabled={isBusy}>
                                                <FormControl>
                                                    <SelectTrigger id="upd-tshirt" className="pl-9">
                                                        <SelectValue placeholder="Select size" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {TSHIRT_SIZES.map((size) => (
                                                        <SelectItem key={size} value={size}>{size}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper id="upd-address" label="Present Address">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <FormControl>
                                                <Input id="upd-address" className="pl-9" {...field} placeholder="Present address" disabled={isBusy} />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper id="upd-blood" label="Blood Group">
                            <FormField
                                control={form.control}
                                name="bloodGroup"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative">
                                            <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 z-10 pointer-events-none" />
                                            <Select onValueChange={field.onChange} value={field.value || undefined} disabled={isBusy}>
                                                <FormControl>
                                                    <SelectTrigger id="upd-blood" className="pl-9">
                                                        <SelectValue placeholder="Select blood group" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {BLOOD_GROUPS.map((bg) => (
                                                        <SelectItem key={bg} value={bg}>
                                                            <span className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> {bg}
                                                            </span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FieldWrapper>

                        <FieldSection title="Contact" icon={Phone} />

                        <FieldWrapper id="upd-phone" label="Phone Number">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <FormControl>
                                                <Input id="upd-phone" className="pl-9" {...field} placeholder="+880 XXXX-XXXXXX" disabled={isBusy} />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper id="upd-whatsapp" label="WhatsApp Number" hint="Defaults to phone number if not set.">
                            <FormField
                                control={form.control}
                                name="whatsapp"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 font-bold text-xs select-none">WA</span>
                                            <FormControl>
                                                <Input id="upd-whatsapp" className="pl-9" {...field} placeholder="+880 XXXX-XXXXXX" disabled={isBusy} />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FieldWrapper>

                        <FieldSection title="NID Information" icon={IdCard} />

                        <FieldWrapper id="upd-nid" label="NID Number" hint="National Identification number — 10 or 17 digits.">
                            <FormField
                                control={form.control}
                                name="nidNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative">
                                            <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <FormControl>
                                                <Input id="upd-nid" className="pl-9 font-mono tracking-widest" {...field} placeholder="0000000000" maxLength={17} disabled={isBusy} />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FieldWrapper>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <NidUploadZone
                                label="NID Front Photo"
                                inputId="nid-front-photo-input"
                                currentUrl={nidFrontCleared ? null : (current.nidPhotoFrontUrl ?? null)}
                                localFile={nidFrontFile}
                                localPreview={nidFrontPreview}
                                isUploading={uploadingSide === 'front'}
                                isDragging={dragTarget === 'front'}
                                onFileSelect={(file) => applyFile(file, 'front')}
                                onClear={() => clearNidPhoto('front')}
                                onDragEnter={onDragEnter('front')}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop('front')}
                            />
                            <NidUploadZone
                                label="NID Back Photo"
                                inputId="nid-back-photo-input"
                                currentUrl={nidBackCleared ? null : (current.nidPhotoBackUrl ?? null)}
                                localFile={nidBackFile}
                                localPreview={nidBackPreview}
                                isUploading={uploadingSide === 'back'}
                                isDragging={dragTarget === 'back'}
                                onFileSelect={(file) => applyFile(file, 'back')}
                                onClear={() => clearNidPhoto('back')}
                                onDragEnter={onDragEnter('back')}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop('back')}
                            />
                        </div>

                        {uploading && (
                            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-lg border border-emerald-100">
                                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                                <span>Uploading NID photos, please wait…</span>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isBusy} className="gap-2">
                                <X className="w-4 h-4" /> Cancel
                            </Button>
                            <Button type="submit" disabled={isBusy} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white min-w-[130px]">
                                {isBusy ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> {uploading ? 'Uploading…' : 'Saving…'}</>
                                ) : (
                                    <><Save className="w-4 h-4" /> Save Changes</>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
