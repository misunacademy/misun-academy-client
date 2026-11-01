'use client';

import { useState } from "react";
import { Edit, Plus, Trash2, Briefcase, Link as LinkIcon, MapPin } from "lucide-react";
import { useForm, useFieldArray, FormProvider, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateUserProfileMutation } from "@/redux/api/profileApi";
import type { ProfileData, EducationEntry } from "@/redux/api/profileApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/forms/input-field";
import { TextareaField } from "@/components/forms/textarea-field";
import { SubmitButton } from "@/components/forms/submit-button";

interface AdditionalInfoProps {
    profile: ProfileData | undefined;
    refetch: () => void;
}

const additionalInfoSchema = z.object({
    bio: z.string().optional(),
    timeZone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    address: z.string().optional(),
    linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    education: z.array(z.object({
        degree: z.string().optional(),
        institution: z.string().optional(),
        passingYear: z.string().optional(),
        result: z.string().optional(),
    })).optional(),
});

type AdditionalInfoFormValues = z.infer<typeof additionalInfoSchema>;

const INPUT_CLASSES = "bg-primary/5 border-primary/20 text-white placeholder:text-white/30";

export function AdditionalInfoTab({ profile, refetch }: AdditionalInfoProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [updateProfile] = useUpdateUserProfileMutation();

    const form = useForm<AdditionalInfoFormValues>({
        resolver: zodResolver(additionalInfoSchema) as Resolver<AdditionalInfoFormValues>,
        defaultValues: {
            bio: profile?.bio || "",
            timeZone: profile?.timeZone || "",
            dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
            address: profile?.address || "",
            linkedinUrl: profile?.linkedinUrl || "",
            education: profile?.education && profile.education.length > 0 ? profile.education : [
                { degree: "", institution: "", passingYear: "", result: "" }
            ],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "education",
    });

    const onSubmit = async (data: AdditionalInfoFormValues) => {
        try {
            const payload = { ...data };
            if (payload.dateOfBirth) {
                payload.dateOfBirth = new Date(payload.dateOfBirth).toISOString();
            }
            if (payload.education) {
                if (payload.education.length > 0 && payload.education[0].degree === "" && payload.education[0].institution === "" && payload.education[0].passingYear === "") {
                    payload.education = [];
                }
            }

            await updateProfile(payload).unwrap();
            toast.success("Additional info updated successfully");
            setIsEditing(false);
            refetch();
        } catch (error: unknown) {
            const apiError = error as { data?: { message?: string } };
            toast.error(apiError?.data?.message || "Failed to update info");
        }
    };

    const renderInfoCard = (Icon: typeof Briefcase, label: string, content: React.ReactNode) => (
        <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-white/40 text-sm mb-1">{label}</p>
                <p className="text-white font-medium text-[15px] leading-relaxed">{content}</p>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col gap-8">
            <div className="bg-surface rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                    <h2 className="text-primary text-2xl font-semibold">Additional Info</h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        aria-label={isEditing ? "Cancel editing" : "Edit additional info"}
                        className="text-white/50 hover:text-primary transition-colors"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                </div>

                {isEditing ? (
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-6 w-full max-w-3xl">
                            <TextareaField
                                name="bio"
                                label="Bio / About Me"
                                labelClassName="text-white/70"
                                placeholder="Tell us a little about yourself"
                                className={INPUT_CLASSES}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    name="dateOfBirth"
                                    label="Date of Birth"
                                    labelClassName="text-white/70"
                                    type="date"
                                    className={INPUT_CLASSES}
                                />
                                <InputField
                                    name="linkedinUrl"
                                    label="LinkedIn URL"
                                    labelClassName="text-white/70"
                                    type="url"
                                    placeholder="https://linkedin.com/in/username"
                                    className={INPUT_CLASSES}
                                />
                            </div>
                            <TextareaField
                                name="address"
                                label="Full Address"
                                labelClassName="text-white/70"
                                placeholder="Enter your complete residential address"
                                className={INPUT_CLASSES}
                            />

                            <div className="space-y-6">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-4 rounded-xl border border-primary/10 bg-primary/5 relative">
                                        <button type="button" onClick={() => remove(index)} aria-label={`Remove education ${index + 1}`} className="absolute top-4 right-4 text-white/40 hover:text-destructive transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <h3 className="text-primary font-medium mb-4">Education #{index + 1}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputField
                                                name={`education.${index}.degree`}
                                                label="Degree / Qualification"
                                                labelClassName="text-white/70"
                                                placeholder="e.g. B.Sc in Computer Science"
                                                className={INPUT_CLASSES}
                                            />
                                            <InputField
                                                name={`education.${index}.institution`}
                                                label="Institution"
                                                labelClassName="text-white/70"
                                                placeholder="e.g. University of Dhaka"
                                                className={INPUT_CLASSES}
                                            />
                                            <InputField
                                                name={`education.${index}.passingYear`}
                                                label="Passing Year"
                                                labelClassName="text-white/70"
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
                                <SubmitButton className="bg-primary hover:bg-primary/90 text-white">
                                    Save Changes
                                </SubmitButton>
                            </div>
                        </form>
                    </FormProvider>
                ) : (
                    <div className="relative z-10 grid gap-6 max-w-3xl">
                        <div className="col-span-1 md:col-span-2">
                            {renderInfoCard(Briefcase, "Bio", 
                                profile?.bio ? (
                                    <p className="text-white font-medium text-[15px] leading-relaxed max-w-3xl">{profile.bio}</p>
                                ) : (
                                    <span className="text-white/30 italic">Not provided</span>
                                )
                            )}
                        </div>
                        <div>
                            {renderInfoCard(MapPin, "Date of Birth",
                                profile?.dateOfBirth ? (
                                    <p className="text-white font-medium text-[15px]">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                                ) : (
                                    <span className="text-white/30 italic">Not provided</span>
                                )
                            )}
                        </div>
                        <div>
                            {renderInfoCard(LinkIcon, "LinkedIn Profile",
                                profile?.linkedinUrl ? (
                                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                        View Link <LinkIcon className="w-4 h-4" />
                                    </a>
                                ) : (
                                    <span className="text-white/30 italic">Not added</span>
                                )
                            )}
                        </div>
                        <div>
                            {renderInfoCard(MapPin, "Address",
                                profile?.address ? (
                                    <p className="text-white font-medium text-[15px] leading-relaxed">{profile.address}</p>
                                ) : (
                                    <span className="text-white/30 italic">Not provided</span>
                                )
                            )}
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <div className="p-4 rounded-xl border border-primary/10 bg-primary/5">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white/40 text-sm mb-1">Education</p>
                                    </div>
                                </div>
                                {profile?.education && profile.education.length > 0 ? (
                                    profile.education.map((edu: EducationEntry, idx: number) => (
                                        <div key={idx} className="p-3 rounded-lg border border-primary/10 bg-primary/5 mb-3 last:mb-0">
                                            <h3 className="text-white font-semibold text-[15px]">{edu.degree}</h3>
                                            <p className="text-white/70 text-sm">{edu.institution} &bull; {edu.passingYear}</p>
                                            {edu.result && <p className="text-white/50 text-xs mt-1">Result: {edu.result}</p>}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white/30 italic text-sm">No education added</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
