'use client';

import { useState } from "react";
import { Edit, Link } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/forms/input-field";
import { SubmitButton } from "@/components/forms/submit-button";
import { useUpdateUserProfileMutation } from "@/redux/api/profileApi";
import { toast } from "sonner";
import { IUserProfile } from "@/types/common";

interface LinksTabProps {
    profile: IUserProfile | null | undefined;
    refetch: () => void;
}

const INPUT_CLASSES = "bg-primary/5 border-primary/20 text-white placeholder:text-white/30";

export function LinksTab({ profile, refetch }: LinksTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [updateProfile] = useUpdateUserProfileMutation();

    const form = useForm({
        defaultValues: { linkedinUrl: profile?.linkedinUrl || "" }
    });

    const onSubmit = async (data: { linkedinUrl?: string }) => {
        try {
            await updateProfile(data).unwrap();
            toast.success("Links updated successfully");
            setIsEditing(false);
            refetch();
        } catch (error) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to update links");
        }
    };

    return (
        <div className="flex-1 bg-surface rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-6 w-full max-w-2xl">
                        <InputField
                            name="linkedinUrl"
                            label="LinkedIn Profile URL"
                            labelClassName="text-white/70"
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            className={INPUT_CLASSES}
                        />
                        <div className="flex justify-end gap-4 mt-4">
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
                <div className="relative z-10">
                    <div className="flex items-start gap-4 p-6 bg-primary/5 border border-primary/10 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <Link className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-white/40 text-sm mb-1.5">LinkedIn Profile</p>
                            <p className="text-white font-medium text-[15px]">
                                {profile?.linkedinUrl ? (
                                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        View Profile
                                    </a>
                                ) : (
                                    <span className="text-white/30 italic">Not added yet</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
