'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Pencil, User, Mail, Phone, MapPin, Droplets, CreditCard, IdCard, Maximize2 } from 'lucide-react';
import { InfoRow, CardIconHeader } from './shared';

interface Props {
    name: string;
    email: string;
    address?: string;
    phone?: string;
    bloodGroup: string;
    nidNumber: string;
    whatsapp: string;
    nidPhotoUrl?: string | null;
    /** Open the parent-controlled edit dialog */
    onEditClick: () => void;
}

export function EmployeeInfoCard({
    name,
    email,
    address,
    phone,
    bloodGroup,
    nidNumber,
    whatsapp,
    nidPhotoUrl,
    onEditClick,
}: Props) {
    return (
        <Card className="lg:col-span-3 shadow-sm border-0 ring-1 ring-gray-100 overflow-hidden">
            {/* ── Header ─────────────────────────────────────────────── */}
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b pb-4">
                <div className="flex items-center justify-between">
                    <CardIconHeader
                        icon={User}
                        title="Employee Information"
                        bgColor="bg-emerald-500"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onEditClick}
                        className="gap-2 text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
                        id="edit-employee-info-btn"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit Info
                    </Button>
                </div>
            </CardHeader>

            {/* ── Body ───────────────────────────────────────────────── */}
            <CardContent className="p-5 divide-y divide-gray-50">
                <InfoRow icon={User} label="Full Name" value={name} highlight />
                <InfoRow icon={Mail} label="Email Address" value={email} />
                <InfoRow
                    icon={MapPin}
                    label="Present Address"
                    value={address || <span className="italic text-gray-400 font-normal">Not provided</span>}
                />
                <InfoRow
                    icon={Phone}
                    label="WhatsApp Number"
                    value={whatsapp || phone || <span className="italic text-gray-400 font-normal">Not provided</span>}
                />
                <InfoRow
                    icon={Droplets}
                    label="Blood Group"
                    value={
                        bloodGroup ? (
                            <span className="inline-flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                                {bloodGroup}
                            </span>
                        ) : undefined
                    }
                    highlight
                />

                <Separator className="!my-2" />

                {/* ── NID Section ───────────────────────────────────── */}
                <div className="pt-3">
                    <div className="flex items-center gap-2 mb-4">
                        <IdCard className="w-4 h-4 text-gray-400" />
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            NID Information
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* NID number */}
                        <div className="flex-1">
                            <p className="text-xs text-gray-400 mb-1.5">NID Number</p>
                            <div className="bg-gray-50 rounded-lg px-3 py-2.5 font-mono text-sm font-semibold text-gray-700 tracking-widest border border-gray-100 select-all">
                                {nidNumber || (
                                    <span className="font-normal text-gray-400 tracking-normal italic">
                                        Not provided
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* NID photo */}
                        <div className="flex-1">
                            <p className="text-xs text-gray-400 mb-1.5">NID Photo</p>
                            {nidPhotoUrl ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="relative group cursor-pointer">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={nidPhotoUrl}
                                                alt="NID"
                                                className="rounded-lg border border-gray-200 w-full h-40 object-contain group-hover:opacity-90 transition-opacity"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                                                <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full shadow-sm pointer-events-none">
                                                    <Maximize2 className="w-4 h-4 text-gray-200" />
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl p-2 bg-transparent border-none shadow-none">
                                        <DialogTitle className="sr-only">NID Photo</DialogTitle>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={nidPhotoUrl}
                                            alt="NID Full"
                                            className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
                                        />
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <div className="rounded-lg border-2 border-dashed border-gray-200 h-24 flex flex-col items-center justify-center gap-1.5 bg-gray-50 text-gray-400">
                                    <CreditCard className="w-6 h-6" />
                                    <p className="text-xs">NID photo not uploaded</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
