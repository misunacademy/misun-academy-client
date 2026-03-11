import { useState } from "react";
import { Edit, Loader2, Plus, Trash2, GraduationCap } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { useUpdateUserProfileMutation } from "@/redux/features/profile/profileApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EducationTabProps {
    profile: any;
    refetch: () => void;
}

interface EducationFormValues {
    education: {
        degree: string;
        institution: string;
        passingYear: string;
        result?: string;
    }[];
}

export function EducationTab({ profile, refetch }: EducationTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

    const { register, control, handleSubmit, formState: { errors } } = useForm<EducationFormValues>({
        defaultValues: {
            education: profile?.education?.length > 0 ? profile.education : [{ degree: "", institution: "", passingYear: "", result: "" }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "education"
    });

    const onSubmit = async (data: any) => {
        try {
            await updateProfile(data).unwrap();
            toast.success("Education history updated successfully");
            setIsEditing(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update education");
        }
    };

    return (
        <div className="flex-1 bg-[#060f0a] rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                <h2 className="text-primary text-2xl font-semibold">Educational Background</h2>
                <button
                    onClick={() => {
                        if (!isEditing && fields.length === 0) {
                            append({ degree: "", institution: "", passingYear: "", result: "" });
                        }
                        setIsEditing(!isEditing);
                    }}
                    className="text-white/50 hover:text-primary transition-colors"
                >
                    <Edit className="w-5 h-5" />
                </button>
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-6 w-full max-w-3xl">
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
                    {profile?.education && profile.education.length > 0 ? (
                        profile.education.map((edu: any, index: number) => (
                            <div key={index} className="flex gap-4 p-5 rounded-xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <GraduationCap className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-white font-semibold text-lg">{edu.degree}</h3>
                                        <span className="text-primary text-sm font-medium bg-primary/10 px-2 py-0.5 rounded-full">{edu.passingYear}</span>
                                    </div>
                                    <p className="text-white/70 mb-2">{edu.institution}</p>
                                    {edu.result && (
                                        <p className="text-white/50 text-sm">Result: <span className="text-white/90">{edu.result}</span></p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
                            <GraduationCap className="w-12 h-12 text-primary/40 mb-4" />
                            <h3 className="text-lg text-white/90 font-medium mb-2">No Education Added</h3>
                            <p className="text-white/50 max-w-md mb-6">
                                Add your educational background to complete your profile structure.
                            </p>
                            <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary-glow text-white">
                                Add Education
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
