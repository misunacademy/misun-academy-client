import { useState } from "react";
import { Edit, Loader2, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUpdateUserProfileMutation } from "@/redux/features/profile/profileApi";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ProfileMainTabProps {
    profile: any;
    user: any;
    studentId: string;
    phone: string;
    whatsapp: string;
    sessions: any[];
    handleRevokeSession: (token: string) => void;
    refetch: () => void;
}

export function ProfileMainTab({
    profile,
    user,
    studentId,
    phone,
    whatsapp,
    sessions,
    handleRevokeSession,
    refetch
}: ProfileMainTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
    const { updateUserProfile } = useAuth(); // for updating auth user info (like name)

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: user.name || "",
            phone: profile?.phone || user.phone || "",
            whatsapp: profile?.whatsapp || profile?.phone || "",
        }
    });

    const onSubmit = async (data: any) => {
        try {
            // Update the profile data (phone, whatsapp)
            await updateProfile({
                phone: data.phone,
                whatsapp: data.whatsapp,
            }).unwrap();

            // Check if name changed to update the auth user
            if (data.name !== user.name) {
                await updateUserProfile({
                    name: data.name
                });
            }

            toast.success("Profile updated successfully");
            setIsEditing(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update profile");
        }
    };

    return (
        <div className="flex-1 bg-[#060f0a] rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">

            {/* Ambient glow inside right panel */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
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
                <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-6 w-full max-w-2xl mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-white/70 text-sm">Full Name</label>
                            <Input
                                {...register("name")}
                                className="bg-primary/5 border-primary/20 text-white"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-white/70 text-sm">Email <span className="text-xs text-white/30">(Cannot be changed)</span></label>
                            <Input
                                value={user.email}
                                disabled
                                className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-white/70 text-sm">Mobile Number</label>
                            <Input
                                {...register("phone")}
                                className="bg-primary/5 border-primary/20 text-white"
                                placeholder="e.g. +8801XXXXXXXXX"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-white/70 text-sm">WhatsApp Number</label>
                            <Input
                                {...register("whatsapp")}
                                className="bg-primary/5 border-primary/20 text-white"
                                placeholder="e.g. +8801XXXXXXXXX"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent border-primary/20 text-white hover:bg-white/5">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-glow text-white">
                            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Save Changes
                        </Button>
                    </div>
                </form>
            ) : (
                /* Info Grid */
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
                        <p className="text-white font-medium text-[15px]">{whatsapp}</p>
                    </div>
                </div>
            )}

            {/* Device Activity Section */}
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
                            sessions.map((sess, idx) => (
                                <tr key={sess.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                                    <td className="py-4 px-4 text-white/70 text-sm">{idx + 1}</td>
                                    <td className="py-4 px-4 text-white/70 text-sm">
                                        {/* Guess OS from user agent if available, else show a default */}
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
                                <td colSpan={4} className="py-8 text-center text-white/40">
                                    No active sessions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
