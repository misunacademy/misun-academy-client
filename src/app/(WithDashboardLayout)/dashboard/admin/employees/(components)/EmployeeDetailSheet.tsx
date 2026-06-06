'use client';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Mail, Phone, MapPin, CalendarDays, Briefcase,
    Droplets, CreditCard, IdCard, MessageCircle, PencilRuler, Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface EmployeeListItem {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    image?: string;
    role: string;
    status: string;
    createdAt: string;
    // extended profile (may be null if not yet filled)
    whatsapp?: string | null;
    bloodGroup?: string | null;
    nidNumber?: string | null;
    dateOfBirth?: string | null;
    tshirtSize?: string | null;
    designation?: string | null;
    nidPhotoFrontUrl?: string | null;
    nidPhotoBackUrl?: string | null;
    nidPhotoUrl?: string | null;
}

interface Props {
    employee: EmployeeListItem | null;
    open: boolean;
    onClose: () => void;
}

// ─── Row helper ───────────────────────────────────────────────────────────────
function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: React.ComponentType<any>;
    label: string;
    value?: string | null;
}) {
    return (
        <div className="flex items-start gap-3 py-2.5">
            <div className="mt-0.5 w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {label}
                </p>
                <p className="text-sm font-medium text-foreground mt-0.5 break-words">
                    {value || <span className="italic text-muted-foreground font-normal">Not provided</span>}
                </p>
            </div>
        </div>
    );
}

// ─── Sheet ────────────────────────────────────────────────────────────────────
export function EmployeeDetailSheet({ employee, open, onClose }: Props) {
    if (!employee) return null;

    const initials = employee.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const isActive = employee.status.toLowerCase() === 'active';
    const dob = employee.dateOfBirth ? new Date(employee.dateOfBirth) : null;
    const dobValue = dob && !Number.isNaN(dob.getTime())
        ? dob.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : null;
    const nidFrontUrl = employee.nidPhotoFrontUrl ?? employee.nidPhotoUrl ?? null;
    const nidBackUrl = employee.nidPhotoBackUrl ?? null;

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto p-0">

                {/* ── Header ─────────────────────────────────────────── */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                            {employee.image && <AvatarImage src={employee.image} />}
                            <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <SheetTitle className="text-base font-bold truncate">
                                {employee.name}
                            </SheetTitle>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                <SheetDescription className="text-xs capitalize">
                                    {employee.role}
                                </SheetDescription>
                                <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                                    {employee.designation || 'No designation'}
                                </Badge>
                            </div>
                            <Badge
                                variant={isActive ? 'default' : 'secondary'}
                                className="mt-1.5 text-xs"
                            >
                                {employee.status}
                            </Badge>
                        </div>
                    </div>
                </SheetHeader>

                <div className="px-6 py-5 space-y-1">

                    {/* ── Contact ──────────────────────────────────────── */}
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        Contact Information
                    </p>

                    <InfoRow icon={Mail} label="Email Address" value={employee.email} />
                    <InfoRow icon={Phone} label="Phone Number" value={employee.phone} />
                    <InfoRow icon={MessageCircle} label="WhatsApp" value={employee.whatsapp} />
                    <InfoRow icon={MapPin} label="Address" value={employee.address} />

                    <Separator className="!my-4" />

                    {/* ── Personal ─────────────────────────────────────── */}
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        Personal Details
                    </p>

                    <InfoRow
                        icon={Droplets}
                        label="Blood Group"
                        value={employee.bloodGroup}
                    />
                    <InfoRow
                        icon={CalendarDays}
                        label="Date of Birth"
                        value={dobValue}
                    />
                    <InfoRow
                        icon={Briefcase}
                        label="Designation"
                        value={employee.designation}
                    />
                    <InfoRow
                        icon={PencilRuler}
                        label="T-shirt Size"
                        value={employee.tshirtSize}
                    />
                    <InfoRow
                        icon={CalendarDays}
                        label="Joined"
                        value={new Date(employee.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric',
                        })}
                    />
                    <InfoRow icon={Briefcase} label="Role" value={employee.role} />

                    <Separator className="!my-4" />

                    {/* ── NID ──────────────────────────────────────────── */}
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        NID Information
                    </p>

                    <InfoRow icon={IdCard} label="NID Number" value={employee.nidNumber} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                NID Front
                            </p>
                            {nidFrontUrl ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="relative group cursor-pointer">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={nidFrontUrl}
                                                alt="NID Front"
                                                className="w-full h-32 object-cover rounded-xl border group-hover:opacity-90 transition-opacity"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
                                                <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full shadow-sm pointer-events-none">
                                                    <Maximize2 className="w-4 h-4 text-gray-200" />
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl p-2 bg-transparent border-none shadow-none">
                                        <DialogTitle className="sr-only">NID Front Photo</DialogTitle>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={nidFrontUrl}
                                            alt="NID Front Full"
                                            className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
                                        />
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <div className="w-full h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/30">
                                    <CreditCard className="w-6 h-6" />
                                    <p className="text-xs">No NID front photo</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                NID Back
                            </p>
                            {nidBackUrl ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="relative group cursor-pointer">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={nidBackUrl}
                                                alt="NID Back"
                                                className="w-full h-32 object-cover rounded-xl border group-hover:opacity-90 transition-opacity"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
                                                <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full shadow-sm pointer-events-none">
                                                    <Maximize2 className="w-4 h-4 text-gray-200" />
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl p-2 bg-transparent border-none shadow-none">
                                        <DialogTitle className="sr-only">NID Back Photo</DialogTitle>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={nidBackUrl}
                                            alt="NID Back Full"
                                            className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
                                        />
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <div className="w-full h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/30">
                                    <CreditCard className="w-6 h-6" />
                                    <p className="text-xs">No NID back photo</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
}
