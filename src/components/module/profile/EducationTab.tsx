'use client';

import { useState } from "react";
import { Edit, Plus, Trash2, GraduationCap } from "lucide-react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { useUpdateUserProfileMutation } from "@/redux/api/profileApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/forms/input-field";
import { SubmitButton } from "@/components/forms/submit-button";
import { IUserProfile, IEducationItem } from "@/types/common";

interface EducationTabProps {
    profile: IUserProfile | null | undefined;
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

const INPUT_CLASSES = "bg-primary/5 border-primary/20 text-white placeholder:text-white/30";

export function EducationTab({ profile, refetch }: EducationTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [updateProfile] = useUpdateUserProfileMutation();

    const form = useForm<EducationFormValues>({
        defaultValues: {
            education: profile?.education && profile.education.length > 0
                ? profile.education
                : [{ degree: "", institution: "", passingYear: "", result: "" }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "education"
    });

    const onSubmit = async (data: EducationFormValues) => {
        try {
            await updateProfile(data).unwrap();
            toast.success("Education history updated successfully");
            setIsEditing(false);
            refetch();
        } catch (error) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to update education");
        }
    };

    return (
        <div className="flex-1 bg-surface rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
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
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-6 w-full max-w-3xl">
                        <div className="space-y-6">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-4 rounded-xl border border-primary/20 bg-primary/5 relative">
                                    <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 text-white/40 hover:text-red-400 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <h3 className="text-primary font-medium mb-4">Education #{index + 1}</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            name={`education.${index}.degree`}
                                            label="Degree / Qualification"
                                            labelClassName="text-white/70"
                                            required
                                            rules={{ required: "Degree is required" }}
                                            placeholder="e.g. B.Sc in Computer Science"
                                            className={INPUT_CLASSES}
                                        />
                                        <InputField
                                            name={`education.${index}.institution`}
                                            label="Institution"
                                            labelClassName="text-white/70"
                                            required
                                            rules={{ required: "Institution is required" }}
                                            placeholder="e.g. University of Dhaka"
                                            className={INPUT_CLASSES}
                                        />
                                        <InputField
                                            name={`education.${index}.passingYear`}
                                            label="Passing Year"
                                            labelClassName="text-white/70"
                                            required
                                            rules={{ required: "Passing year is required" }}
                                            placeholder="e.g. 2023"
                                            className={INPUT_CLASSES}
                                        />
                                        <InputField
                                            name={`education.${index}.result`}
                                            label="Result / CGPA (Optional)"
                                            labelClassName="text-white/70"
                                            placeholder="e.g. 3.80"
                                            className={INPUT_CLASSES}
                                        />
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
                            <SubmitButton className="bg-primary hover:bg-primary-glow text-white">
                                Save Changes
                            </SubmitButton>
                        </div>
                    </form>
                </FormProvider>
            ) : (
                <div className="relative z-10 grid gap-6 max-w-3xl">
                    {profile?.education && profile.education.length > 0 ? (
                        profile.education.map((edu: IEducationItem, index: number) => (
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
