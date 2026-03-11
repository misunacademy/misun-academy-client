/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { useUpdateUserProfileMutation } from "@/redux/features/profile/profileApi";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdditionalInfoProps {
    profile: any;
    refetch: () => void;
}

interface FormValues {
    bio: string;
    timeZone?: string;
    dateOfBirth?: string;
    address?: string;
    linkedinUrl?: string;
    education: {
        degree: string;
        institution: string;
        passingYear: string;
        result?: string;
    }[];
}

export function AdditionalInfoTab({ profile, refetch }: AdditionalInfoProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

    const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            bio: profile?.bio || "",
            timeZone: profile?.timeZone || "",
            dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
            address: profile?.address || "",
            linkedinUrl: profile?.linkedinUrl || "",
            education: profile?.education && profile.education.length > 0 ? profile.education : [{ degree: "", institution: "", passingYear: "", result: "" }],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "education",
    });

    const onSubmit = async (data: any) => {
        try {
            const payload = { ...data };
            if (payload.dateOfBirth) {
                payload.dateOfBirth = new Date(payload.dateOfBirth).toISOString();
            }
            // education array stays as-is

            await updateProfile(payload).unwrap();
            toast.success("Additional info updated successfully");
            setIsEditing(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update info");
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-8">
            {/* primary additional info card */}
            <div className="bg-[#060f0a] rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                    <h2 className="text-primary text-2xl font-semibold">Additional Info</h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-white/50 hover:text-primary transition-colors"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-6 w-full max-w-3xl">
                        {/* bio and dob */}
                        <div className="space-y-2">
                            <label className="text-white/70 text-sm">Bio / About Me</label>
                            <textarea
                                {...register("bio")}
                                className="w-full bg-primary/5 border border-primary/20 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 min-h-[100px]"
                                placeholder="Tell us a little about yourself"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-white/70 text-sm">Date of Birth</label>
                                <Input
                                    type="date"
                                    {...register("dateOfBirth")}
                                    className="bg-primary/5 border-primary/20 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-white/70 text-sm">LinkedIn URL</label>
                                <Input
                                    type="url"
                                    {...register("linkedinUrl")}
                                    placeholder="https://linkedin.com/in/username"
                                    className="bg-primary/5 border-primary/20 text-white"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-white/70 text-sm">Full Address</label>
                            <textarea
                                {...register("address")}
                                className="w-full bg-primary/5 border border-primary/20 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 min-h-[120px]"
                                placeholder="Enter your complete residential address"
                            />
                        </div>

                        {/* education array */}
                        <div className="space-y-6">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-4 rounded-xl border border-primary/20 bg-primary/5 relative">
                                    <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 text-white/40 hover:text-red-400 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <h3 className="text-primary font-medium mb-4">Education #{index + 1}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-white/70 text-sm">Degree / Qualification *</label>
                                            <Input
                                                {...register(`education.${index}.degree`, { required: "Degree is required" })}
                                                placeholder="e.g. B.Sc in Computer Science"
                                                className="bg-primary/5 border-primary/20 text-white"
                                            />
                                            {errors.education?.[index]?.degree && <p className="text-red-400 text-xs mt-1">{errors.education[index]?.degree?.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-white/70 text-sm">Institution *</label>
                                            <Input
                                                {...register(`education.${index}.institution`, { required: "Institution is required" })}
                                                placeholder="e.g. University of Dhaka"
                                                className="bg-primary/5 border-primary/20 text-white"
                                            />
                                            {errors.education?.[index]?.institution && <p className="text-red-400 text-xs mt-1">{errors.education[index]?.institution?.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-white/70 text-sm">Passing Year *</label>
                                            <Input
                                                {...register(`education.${index}.passingYear`, { required: "Passing year is required" })}
                                                placeholder="e.g. 2023"
                                                className="bg-primary/5 border-primary/20 text-white"
                                            />
                                            {errors.education?.[index]?.passingYear && <p className="text-red-400 text-xs mt-1">{errors.education[index]?.passingYear?.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-white/70 text-sm">Result / CGPA (Optional)</label>
                                            <Input
                                                {...register(`education.${index}.result`)}
                                                placeholder="e.g. 3.80"
                                                className="bg-primary/5 border-primary/20 text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => append({ degree: "", institution: "", passingYear: "", result: "" })}
                                className="border-primary/20 text-primary hover:bg-primary/10 gap-2 w-full md:w-auto"
                            >
                                <Plus className="w-4 h-4" /> Add Another Degree
                            </Button>
                        </div>

                        <div className="flex justify-end gap-4 mt-4 border-t border-dashed border-primary/20 pt-6">
                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent border-primary/20 text-white hover:bg-white/5">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-glow text-white">
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Save Changes
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="relative z-10 grid gap-6 max-w-3xl">
                        <div className="col-span-1 md:col-span-2">
                            <p className="text-white/40 text-sm mb-1.5">Bio</p>
                            <p className="text-white font-medium text-[15px] leading-relaxed max-w-3xl">
                                {profile?.bio || <span className="text-white/30 italic">Not provided</span>}
                            </p>
                        </div>
                        <div>
                            <p className="text-white/40 text-sm mb-1.5">Date of Birth</p>
                            <p className="text-white font-medium text-[15px]">
                                {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : <span className="text-white/30 italic">Not provided</span>}
                            </p>
                        </div>
                        <div>
                            <p className="text-white/40 text-sm mb-1.5">LinkedIn Profile</p>
                            <p className="text-white font-medium text-[15px]">
                                {profile?.linkedinUrl ? (
                                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        View Link
                                    </a>
                                ) : <span className="text-white/30 italic">Not added</span>}
                            </p>
                        </div>
                        <div>
                            <p className="text-white/40 text-sm mb-1.5">Address</p>
                            <p className="text-white font-medium text-[15px] leading-relaxed">
                                {profile?.address || <span className="text-white/30 italic">Not provided</span>}
                            </p>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <p className="text-white/40 text-sm mb-1.5">Education</p>
                            {profile?.education && profile.education.length > 0 ? (
                                profile.education.map((edu: any, idx: number) => (
                                    <div key={idx} className="mb-4">
                                        <h3 className="text-white font-semibold">{edu.degree}</h3>
                                        <p className="text-white/70">{edu.institution} &bull; {edu.passingYear}</p>
                                        {edu.result && <p className="text-white/50 text-sm">Result: {edu.result}</p>}
                                    </div>
                                ))
                            ) : (
                                <p className="text-white/30 italic">No education added</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
