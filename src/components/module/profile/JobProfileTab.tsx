'use client';

import { useState } from "react";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/forms/input-field";
import { SelectField } from "@/components/forms/select-field";
import { SubmitButton } from "@/components/forms/submit-button";
import { useUpdateUserProfileMutation } from "@/redux/api/profileApi";
import { toast } from "sonner";
import { IUserProfile } from "@/types/common";

interface JobProfileTabProps {
    profile: IUserProfile | null | undefined;
    refetch: () => void;
}

const INPUT_CLASSES = "bg-primary/5 border-primary/20 text-white placeholder:text-white/30";

const EXPERIENCE_OPTIONS = [
    { value: "0-1", label: "0-1 years" },
    { value: "1-3", label: "1-3 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "5-10", label: "5-10 years" },
    { value: "10+", label: "10+ years" },
];

interface JobProfileFormData {
    currentJob?: string;
    company?: string;
    industry?: string;
    experience?: string;
}

export function JobProfileTab({ profile, refetch }: JobProfileTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [updateProfile] = useUpdateUserProfileMutation();

    const form = useForm<JobProfileFormData>({
        defaultValues: {
            currentJob: profile?.currentJob || "",
            company: profile?.company || "",
            industry: profile?.industry || "",
            experience: profile?.experience || "",
        }
    });

    const onSubmit = async (data: JobProfileFormData) => {
        try {
            await updateProfile(data).unwrap();
            toast.success("Job profile updated successfully");
            setIsEditing(false);
            refetch();
        } catch (error) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to update job profile");
        }
    };

    return (
        <div className="flex-1 bg-surface rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                        <InputField name="currentJob" label="Current Job Title" labelClassName="text-white/70" placeholder="e.g. Senior Frontend Developer" className={INPUT_CLASSES} />
                        <InputField name="company" label="Company" labelClassName="text-white/70" placeholder="Where do you work?" className={INPUT_CLASSES} />
                        <InputField name="industry" label="Industry" labelClassName="text-white/70" placeholder="e.g. Software, Healthcare, Finance" className={INPUT_CLASSES} />
                        <SelectField name="experience" label="Total Experience" labelClassName="text-white/70" options={EXPERIENCE_OPTIONS} placeholder="Select experience level" />
                        <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
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
