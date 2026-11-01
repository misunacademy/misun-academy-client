'use client';

import { useState } from "react";
import { Edit, Clock, Laptop, Smartphone, User } from "lucide-react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/forms/input-field";
import { SubmitButton } from "@/components/forms/submit-button";
import { useUpdateUserProfileMutation } from "@/redux/api/profileApi";
import type { ProfileData } from "@/redux/api/profileApi";
import { useAuth } from "@/hooks/useAuth";
import type { AuthUser } from "@/types/auth";
import { toast } from "sonner";
import { format } from "date-fns";

interface SessionInfo {
    id: string;
    token: string;
    createdAt: string;
    userAgent?: string;
    isCurrent?: boolean;
}

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    wpnumber: z.string().optional().or(z.literal("")),
}).refine((data) => {
    const phoneOk = !data.phone || /^\+?[0-9\s\-()]{7,20}$/.test(data.phone);
    const wpOk = !data.wpnumber || /^\+?[0-9\s\-()]{7,20}$/.test(data.wpnumber);
    return phoneOk && wpOk;
}, { message: "Please enter a valid phone number" });

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileMainTabProps {
    profile: ProfileData | undefined;
    user: AuthUser;
    studentId: string;
    phone: string;
    wpnumber: string;
    sessions: SessionInfo[];
    handleRevokeSession: (token: string) => void;
    refetch: () => void;
}

const INPUT_CLASSES = "bg-primary/5 border-primary/20 text-white placeholder:text-white/30 focus:border-primary focus:ring-1 focus:ring-primary/30";

export function ProfileMainTab({
    profile,
    user,
    studentId,
    phone,
    wpnumber,
    sessions,
    handleRevokeSession,
    refetch
}: ProfileMainTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [updateProfile] = useUpdateUserProfileMutation();
    const { updateUserProfile } = useAuth();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema) as Resolver<ProfileFormValues>,
        defaultValues: {
            name: profile?.user?.name || "",
            phone: profile?.user?.phone || "",
            wpnumber: profile?.wpnumber || "",
        }
    });

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            await updateProfile({
                phone: data.phone || undefined,
                wpnumber: data.wpnumber || undefined,
            }).unwrap();

            if (data.name && data.name !== user.name) {
                await updateUserProfile({ name: data.name });
            }

            toast.success("Profile updated successfully");
            setIsEditing(false);
            refetch();
        } catch (error: unknown) {
            const apiError = error as { data?: { message?: string } };
            toast.error(apiError?.data?.message || "Failed to update profile");
        }
    };

    const getDeviceIcon = (userAgent?: string) => {
        if (!userAgent) return Laptop;
        if (userAgent.includes('Windows')) return Laptop;
        if (userAgent.includes('Mac')) return Smartphone;
        if (userAgent.includes('Linux')) return Laptop;
        return Laptop;
    };

    const renderProfileCard = (Icon: typeof Laptop, label: string, value: string) => (
        <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-white/40 text-xs font-medium mb-1">{label}</p>
                <p className="text-white font-medium text-[14px] leading-snug truncate">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="flex-1 bg-surface rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                <h2 className="text-primary text-2xl font-semibold">My Profile</h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    aria-label={isEditing ? "Cancel editing" : "Edit profile"}
                    className="text-white/50 hover:text-primary transition-colors"
                >
                    <Edit className="w-5 h-5" />
                </button>
            </div>

            {isEditing ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-6 w-full max-w-2xl mb-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField name="name" label="Full Name" labelClassName="text-white/70" className={INPUT_CLASSES} />
                            <div className="space-y-2">
                                <label className="text-white/70 text-sm">Email <span className="text-xs text-white/30">(Cannot be changed)</span></label>
                                <Input
                                    value={profile?.user?.email}
                                    disabled
                                    className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed rounded-xl"
                                />
                            </div>
                            <InputField name="phone" label="Mobile Number" labelClassName="text-white/70" placeholder="e.g. +8801XXXXXXXXX" className={INPUT_CLASSES} />
                            <InputField name="wpnumber" label="WhatsApp Number" labelClassName="text-white/70" placeholder="e.g. +8801XXXXXXXXX" className={INPUT_CLASSES} />
                        </div>
                        <div className="flex justify-end gap-4 mt-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent border-primary/20 text-white hover:bg-white/5">
                                Cancel
                            </Button>
                            <SubmitButton className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_hsl(156_70%_42%/0.4)]">
                                Save Changes
                            </SubmitButton>
                        </div>
                    </form>
                </Form>
            ) : (
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12 mb-16">
                    {[
                        { label: "Full Name", value: user.name, icon: User },
                        { label: "Email", value: user.email, icon: User },
                        { label: "Student ID", value: studentId, icon: User },
                        { label: "Mobile Number", value: phone, icon: Smartphone },
                        { label: "WhatsApp Number", value: wpnumber, icon: Smartphone },
                    ].map((field, idx) => {
                        const Icon = field.icon;
                        return (
                            <div key={field.label} className="group relative">
                                {renderProfileCard(Icon, field.label, field.value)}
                                {idx === 0 && (
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-[0_0_15px_hsl(156_70%_42%/0.5)]">
                                        <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="relative z-10 flex-1">
                <h2 className="text-primary text-xl font-semibold mb-4">Device Activity</h2>
                <div className="relative z-10 w-full border-t border-dashed border-primary/20 mb-4" />
                <div className="relative z-10 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-primary/10">
                                <th className="py-4 px-4 text-primary font-medium bg-primary/5 rounded-l-lg border border-primary/10 border-r-0">Serial</th>
                                <th className="py-4 px-4 text-primary font-medium bg-primary/5 border border-primary/10 border-l-0 border-r-0">Platform</th>
                                <th className="py-4 px-4 text-primary font-medium bg-primary/5 border border-primary/10 border-l-0 border-r-0">Date</th>
                                <th className="py-4 px-4 text-primary font-medium bg-primary/5 rounded-r-lg border border-primary/10 border-l-0">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.length > 0 ? (
                                sessions.map((sess: SessionInfo, idx: number) => {
                                    const Icon = getDeviceIcon(sess.userAgent);
                                    return (
                                        <tr key={sess.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                            <td className="py-4 px-4 text-white/70 text-sm">{idx + 1}</td>
                                            <td className="py-4 px-4 text-white/70 text-sm flex items-center gap-2">
                                                <Icon className="w-4 h-4 text-primary/40" />
                                                <span>
                                                    {sess.userAgent?.includes('Windows') ? 'Windows' :
                                                        sess.userAgent?.includes('Mac') ? 'macOS' :
                                                        sess.userAgent?.includes('Linux') ? 'Linux' : 'Unknown'}
                                                </span>
                                                {sess.isCurrent && <span className="ml-2 text-xs text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">Current</span>}
                                            </td>
                                            <td className="py-4 px-4 text-white/70 text-sm">{format(new Date(sess.createdAt), 'dd-MM-yyyy hh:mm a')}</td>
                                            <td className="py-4 px-4">
                                                {!sess.isCurrent && (
                                                    <button
                                                        onClick={() => handleRevokeSession(sess.token)}
                                                        aria-label={`Remove session ${idx + 1}`}
                                                        className="text-primary text-sm hover:text-primary/70 font-medium transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-white/40">
                                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                        <p>No active sessions found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
