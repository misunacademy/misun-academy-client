import { useState } from "react";
import { Edit, Loader2, Link } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUpdateUserProfileMutation } from "@/redux/features/profile/profileApi";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LinksTabProps {
    profile: any;
    refetch: () => void;
}

export function LinksTab({ profile, refetch }: LinksTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            linkedinUrl: profile?.linkedinUrl || "",
        }
    });

    const onSubmit = async (data: any) => {
        try {
            await updateProfile(data).unwrap();
            toast.success("Links updated successfully");
            setIsEditing(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update links");
        }
    };

    return (
        <div className="flex-1 bg-[#060f0a] rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                <h2 className="text-primary text-2xl font-semibold">Important Links</h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-white/50 hover:text-primary transition-colors"
                >
                    <Edit className="w-5 h-5" />
                </button>
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-6 w-full max-w-2xl">
                    <div className="space-y-2">
                        <label className="text-white/70 text-sm">LinkedIn Profile URL</label>
                        <Input
                            type="url"
                            {...register("linkedinUrl")}
                            placeholder="https://linkedin.com/in/username"
                            className="bg-primary/5 border-primary/20 text-white"
                        />
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent border-primary/20 text-white hover:bg-white/5">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-glow text-white">
                            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Save Changes
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="relative z-10 grid gap-4 max-w-2xl">
                    <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-xl hover:bg-primary/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#0077b5]/20 flex items-center justify-center flex-shrink-0">
                                <Link className="w-5 h-5 text-[#0077b5]" />
                            </div>
                            <div>
                                <p className="text-white font-medium text-[15px]">LinkedIn Profile</p>
                                <p className="text-white/40 text-sm">
                                    {profile?.linkedinUrl ? 'Connected' : 'Not linked yet'}
                                </p>
                            </div>
                        </div>
                        {profile?.linkedinUrl ? (
                            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                                View Profile
                            </a>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="text-white/50 text-sm hover:text-white">
                                Add Link
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
