'use client';

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Shield, Loader2, User } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useUploadSingleImageMutation } from "@/redux/api/uploadApi";
import { useUpdateUserProfileMutation } from "@/redux/api/profileApi";
import { toast } from "sonner";
import { authServerApi } from "@/lib/auth-server-api";
import Image from "next/image";
import { PasswordField } from "@/components/forms/password-field";
import { SubmitButton } from "@/components/forms/submit-button";

interface PasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export function SettingsTab() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { user, isLoading: userLoading, updateUserProfile } = useAuth();
    const [updateProfile, { isLoading: updateLoading }] = useUpdateUserProfileMutation();
    const [uploadImage, { isLoading: uploadLoading }] = useUploadSingleImageMutation();

    const userInitials = user?.name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    const passwordForm = useForm<PasswordFormValues>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }
    });

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Please select an image smaller than 5MB.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("image", file);

            const uploadResult = await uploadImage(formData).unwrap();

            await updateProfile({
                avatar: uploadResult.data.url,
            }).unwrap();

            await updateUserProfile({
                image: uploadResult.data.url,
            });

            toast.success("Profile photo updated successfully.");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            let errorMessage = "Failed to upload photo. Please try again.";

            if (error && typeof error === 'object') {
                if ('status' in error) {
                    const fetchError = error as { status: number; data?: { message?: string } };
                    errorMessage = fetchError.data?.message || `Upload failed with status ${fetchError.status}`;
                } else if ('data' in error) {
                    const apiError = error as { data?: { message?: string } };
                    errorMessage = apiError.data?.message || errorMessage;
                } else if ('message' in error) {
                    const generalError = error as { message: string };
                    errorMessage = generalError.message;
                }
            }

            toast.error(errorMessage);
        }
    };

    const handleChangePassword = async (data: PasswordFormValues) => {
        const { currentPassword, newPassword, confirmPassword } = data;

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        try {
            const result = await authServerApi.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: false,
            });

            if (result.error) {
                toast.error(result.error.message || "Failed to change password.");
                return;
            }

            toast.success("Password changed successfully.");
            passwordForm.reset();
        } catch (error) {
            console.error("Password change error:", error);
            let errorMessage = "Failed to change password.";

            if (error && typeof error === 'object') {
                if ('data' in error) {
                    const apiError = error as { data?: { message?: string } };
                    errorMessage = apiError.data?.message || errorMessage;
                } else if ('message' in error) {
                    const generalError = error as { message: string };
                    errorMessage = generalError.message;
                }
            }

            toast.error(errorMessage);
        }
    };

    if (userLoading) {
        return (
            <div className="flex-1 bg-surface rounded-2xl border border-primary/20 p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex-1 bg-surface rounded-2xl border border-primary/20 p-8 flex items-center justify-center min-h-[400px]">
                <p className="text-red-400">Error loading user data</p>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-surface rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                <div>
                    <h2 className="text-primary text-2xl font-semibold flex items-center gap-2 mb-1">
                        Settings
                    </h2>
                    <p className="text-white/50 text-sm">Manage your account settings and preferences.</p>
                </div>
            </div>

            <div className="relative z-10 grid gap-8">
                <div className="flex flex-col gap-6 p-6 rounded-xl border border-primary/10 bg-primary/5">
                    <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
                        <User className="w-5 h-5 text-primary" />
                        <h3 className="text-white font-medium text-lg leading-tight">Profile Photo</h3>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary via-primary-glow to-primary shadow-[0_0_20px_hsl(156_70%_42%/0.4)] flex-shrink-0">
                            <div className="w-full h-full rounded-full border-4 border-surface overflow-hidden bg-[#0a1510] relative flex items-center justify-center">
                                {user.image ? (
                                    <Image src={user.image} alt={user.name!} fill sizes="96px" className="object-cover" />
                                ) : (
                                    <div className="text-2xl font-bold text-white/50">
                                        {userInitials}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-center sm:items-start gap-4 flex-1">
                            <div className="text-center sm:text-left">
                                <p className="text-white font-medium">{user?.name}</p>
                                <p className="text-white/50 text-sm">{user?.email}</p>
                            </div>

                            <Button
                                variant="outline"
                                onClick={handlePhotoClick}
                                disabled={uploadLoading || updateLoading}
                                className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition-colors w-full sm:w-auto"
                            >
                                {uploadLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Camera className="mr-2 h-4 w-4" />
                                        Change Photo
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-white/30 text-center sm:text-left">
                                Supported formats: JPEG, PNG, WEBP. Max size: 5MB.
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 p-6 rounded-xl border border-primary/10 bg-primary/5">
                    <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
                        <Shield className="w-5 h-5 text-primary" />
                        <h3 className="text-white font-medium text-lg leading-tight">Security</h3>
                    </div>

                    <FormProvider {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-6 max-w-md">
                            <PasswordField
                                name="currentPassword"
                                label="Current Password"
                                labelClassName="text-white/70"
                                required
                                rules={{ required: "Current password is required" }}
                                placeholder="Enter current password"
                                className="bg-primary/5 border-primary/20 text-white placeholder:text-white/20"
                            />
                            <PasswordField
                                name="newPassword"
                                label="New Password"
                                labelClassName="text-white/70"
                                required
                                rules={{
                                    required: "New password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters long" }
                                }}
                                placeholder="Enter new password"
                                className="bg-primary/5 border-primary/20 text-white placeholder:text-white/20"
                            />
                            <PasswordField
                                name="confirmPassword"
                                label="Confirm New Password"
                                labelClassName="text-white/70"
                                required
                                rules={{
                                    required: "Please confirm your new password",
                                    validate: (value: string) =>
                                        value === passwordForm.getValues("newPassword") || "Passwords do not match"
                                }}
                                placeholder="Confirm new password"
                                className="bg-primary/5 border-primary/20 text-white placeholder:text-white/20"
                            />

                            <SubmitButton className="bg-primary hover:bg-primary-glow text-white w-full sm:w-auto mt-2">
                                Change Password
                            </SubmitButton>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
}
