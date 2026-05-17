'use client';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Mail, Phone, MapPin, CalendarDays, Briefcase,
    Droplets, CreditCard, IdCard, MessageCircle,
} from 'lucide-react';

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
                            <SheetDescription className="text-xs capitalize mt-0.5">
                                {employee.role}
                            </SheetDescription>
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

                    <InfoRow icon={Mail}           label="Email Address"  value={employee.email} />
                    <InfoRow icon={Phone}          label="Phone Number"   value={employee.phone} />
                    <InfoRow icon={MessageCircle}  label="WhatsApp"       value={employee.whatsapp} />
                    <InfoRow icon={MapPin}         label="Address"        value={employee.address} />

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

                    {/* NID photo */}
                    <div className="pt-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            NID Photo
                        </p>
                        {employee.nidPhotoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={employee.nidPhotoUrl}
                                alt="NID"
                                className="w-full h-36 object-cover rounded-xl border"
                            />
                        ) : (
                            <div className="w-full h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/30">
                                <CreditCard className="w-6 h-6" />
                                <p className="text-xs">No NID photo uploaded</p>
                            </div>
                        )}
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
}
