import { useState } from "react";
import { Edit, Loader2, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUpdateUserProfileMutation } from "@/redux/features/profile/profileApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface AddressTabProps {
    profile: any;
    refetch: () => void;
}

export function AddressTab({ profile, refetch }: AddressTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            address: profile?.address || "",
        }
    });

    const onSubmit = async (data: any) => {
        try {
            await updateProfile(data).unwrap();
            toast.success("Address updated successfully");
            setIsEditing(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update address");
        }
    };

    return (
        <div className="flex-1 bg-[#060f0a] rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                <h2 className="text-primary text-2xl font-semibold">Address Details</h2>
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
                        <label className="text-white/70 text-sm">Full Address</label>
                        <textarea
                            {...register("address")}
                            className="w-full bg-primary/5 border border-primary/20 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 min-h-[120px]"
                            placeholder="Enter your complete residential address"
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
                <div className="relative z-10">
                    <div className="flex items-start gap-4 p-6 bg-primary/5 border border-primary/10 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-white/40 text-sm mb-1.5">Current Address</p>
                            <p className="text-white font-medium text-[15px] leading-relaxed max-w-2xl">
                                {profile?.address || <span className="text-white/30 italic">No address provided. Click edit to add your location.</span>}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
