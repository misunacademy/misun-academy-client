import { useState } from "react";
import { Edit, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUpdateUserProfileMutation } from "@/redux/features/profile/profileApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobProfileTabProps {
    profile: any;
    refetch: () => void;
}

export function JobProfileTab({ profile, refetch }: JobProfileTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            currentJob: profile?.currentJob || "",
            company: profile?.company || "",
            industry: profile?.industry || "",
            experience: profile?.experience || undefined,
        }
    });

    const onSubmit = async (data: any) => {
        try {
            await updateProfile(data).unwrap();
            toast.success("Job profile updated successfully");
            setIsEditing(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update job profile");
        }
    };

    return (
        <div className="flex-1 bg-[#060f0a] rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                <h2 className="text-primary text-2xl font-semibold">Job Profile</h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-white/50 hover:text-primary transition-colors"
                >
                    <Edit className="w-5 h-5" />
                </button>
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                    <div className="space-y-2">
                        <label className="text-white/70 text-sm">Current Job Title</label>
                        <input
                            {...register("currentJob")}
                            className="w-full bg-primary/5 border border-primary/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary/50"
                            placeholder="e.g. Senior Frontend Developer"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-white/70 text-sm">Company</label>
                        <input
                            {...register("company")}
                            className="w-full bg-primary/5 border border-primary/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary/50"
                            placeholder="Where do you work?"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-white/70 text-sm">Industry</label>
                        <input
                            {...register("industry")}
                            className="w-full bg-primary/5 border border-primary/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary/50"
                            placeholder="e.g. Software, Healthcare, Finance"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-white/70 text-sm">Total Experience</label>
                        <Select
                            value={watch('experience') || ''}
                            onValueChange={(value) => setValue('experience', value)}
                        >
                            <SelectTrigger className="w-full bg-primary/5 border-primary/20 text-white">
                                <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#12111A] border-primary/20 text-white">
                                <SelectItem value="0-1">0-1 years</SelectItem>
                                <SelectItem value="1-3">1-3 years</SelectItem>
                                <SelectItem value="3-5">3-5 years</SelectItem>
                                <SelectItem value="5-10">5-10 years</SelectItem>
                                <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent border-primary/20 text-white hover:bg-white/5">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-glow text-white">
                            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Save Changes
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-16 relative z-10">
                    <div>
                        <p className="text-white/40 text-sm mb-1.5">Current Job Title</p>
                        <p className="text-white font-medium text-[15px] max-w-md">
                            {profile?.currentJob || <span className="text-white/30 italic">Not provided</span>}
                        </p>
                    </div>
                    <div>
                        <p className="text-white/40 text-sm mb-1.5">Company</p>
                        <p className="text-white font-medium text-[15px]">
                            {profile?.company || <span className="text-white/30 italic">Not provided</span>}
                        </p>
                    </div>
                    <div>
                        <p className="text-white/40 text-sm mb-1.5">Industry</p>
                        <p className="text-white font-medium text-[15px]">
                            {profile?.industry || <span className="text-white/30 italic">Not provided</span>}
                        </p>
                    </div>
                    <div>
                        <p className="text-white/40 text-sm mb-1.5">Total Experience</p>
                        <p className="text-white font-medium text-[15px]">
                            {profile?.experience ? `${profile.experience} years` : <span className="text-white/30 italic">Not provided</span>}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
