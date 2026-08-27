'use client';

import { useState } from "react";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
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

interface ProfileFormData {
    name?: string;
    phone?: string;
    wpnumber?: string;
}

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

const INPUT_CLASSES = "bg-primary/5 border-primary/20 text-white placeholder:text-white/30";

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

    const form = useForm<ProfileFormData>({
        defaultValues: {
            name: profile?.user?.name || "",
            phone: profile?.user?.phone || "",
            wpnumber: profile?.wpnumber || "",
        }
    });

    const onSubmit = async (data: ProfileFormData) => {
        try {
            await updateProfile({
                phone: data.phone,
                wpnumber: data.wpnumber,
            }).unwrap();

            if (data.name !== user.name) {
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

    return (
        <div className="flex-1 bg-surface rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                <h2 className="text-primary text-2xl font-semibold">My Profile</h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
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
                                    className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
                                />
                            </div>
                            <InputField name="phone" label="Mobile Number" labelClassName="text-white/70" placeholder="e.g. +8801XXXXXXXXX" className={INPUT_CLASSES} />
                            <InputField name="wpnumber" label="WhatsApp Number" labelClassName="text-white/70" placeholder="e.g. +8801XXXXXXXXX" className={INPUT_CLASSES} />
                        </div>
                        <div className="flex justify-end gap-4 mt-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent border-primary/20 text-white hover:bg-white/5">
                                Cancel
                            </Button>
                            <SubmitButton className="bg-primary hover:bg-primary-glow text-white">
                                Save Changes
                            </SubmitButton>
                        </div>
                    </form>
                </Form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-16 relative z-10">
                    <div>
                        <p className="text-white/40 text-sm mb-1.5">Full Name</p>
                        <p className="text-white font-medium text-[15px]">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-white/40 text-sm mb-1.5">Email</p>
                        <p className="text-white font-medium text-[15px]">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-white/40 text-sm mb-1.5">Student ID</p>
                        <p className="text-white font-medium text-[15px]">{studentId}</p>
                    </div>
                    <div>
                        <p className="text-white/40 text-sm mb-1.5">Mobile Number</p>
                        <p className="text-white font-medium text-[15px]">{phone}</p>
                    </div>
                    <div>
                        <p className="text-white/40 text-sm mb-1.5">WhatsApp Number</p>
                        <p className="text-white font-medium text-[15px]">{wpnumber}</p>
                    </div>
                </div>
            )}

            <h2 className="relative z-10 text-primary text-xl font-semibold mb-4">Device Activity</h2>
            <div className="relative z-10 w-full border-t border-dashed border-primary/20 mb-6" />
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
                            sessions.map((sess: SessionInfo, idx: number) => (
                                <tr key={sess.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                                    <td className="py-4 px-4 text-white/70 text-sm">{idx + 1}</td>
                                    <td className="py-4 px-4 text-white/70 text-sm">
                                        {sess.userAgent ? (
                                            sess.userAgent.includes('Windows') ? 'Windows 10' :
                                                sess.userAgent.includes('Mac') ? 'macOS Safari' :
                                                    sess.userAgent.includes('Linux') ? 'Linux' : 'Unknown Device'
                                        ) : 'Windows 10'}
                                        {sess.isCurrent && <span className="ml-2 text-xs text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">Current</span>}
                                    </td>
                                    <td className="py-4 px-4 text-white/70 text-sm">{format(new Date(sess.createdAt), 'dd-MM-yyyy hh:mm a')}</td>
                                    <td className="py-4 px-4">
                                        {!sess.isCurrent && (
                                            <button
                                                onClick={() => handleRevokeSession(sess.token)}
                                                className="text-primary text-sm hover:text-primary-glow font-medium transition-colors"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-white/40">No active sessions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
