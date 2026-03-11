/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Shield, Loader2, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUploadSingleImageMutation } from "@/redux/api/uploadApi";
import { useUpdateUserProfileMutation } from "@/redux/features/profile/profileApi";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

interface SettingsTabProps {
    profile?: any;
}

export function SettingsTab({ profile }: SettingsTabProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // API hooks
    const { user, isLoading: userLoading, updateUserProfile } = useAuth();
    const [updateProfile, { isLoading: updateLoading }] = useUpdateUserProfileMutation();
    const [uploadImage, { isLoading: uploadLoading }] = useUploadSingleImageMutation();

    // Form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    const userInitials = user?.name
        ?.split(" ")
        .map((n: any) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    // Handle photo upload
    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Please select an image smaller than 5MB.");
            return;
        }

        try {
            // Upload image
            const formData = new FormData();
            formData.append("image", file);

            const uploadResult = await uploadImage(formData).unwrap();

            // Update profile with new image URL
            await updateProfile({
                avatar: uploadResult.data.url,
            }).unwrap();

            // Update Better Auth session (automatically refreshes)
            await updateUserProfile({
                image: uploadResult.data.url,
            });

            toast.success("Profile photo updated successfully.");

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            let errorMessage = "Failed to upload photo. Please try again.";

            if (error && typeof error === 'object') {
                if ('status' in error) {
                    const fetchError = error as { status: number; data?: any };
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

    // Handle password change
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All password fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        try {
            setPasswordLoading(true);

            const result = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: false,
            });

            if (result.error) {
                toast.error(result.error.message || "Failed to change password.");
                return;
            }

            toast.success("Password changed successfully.");

            // Clear form
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
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
        } finally {
            setPasswordLoading(false);
        }
    };

    if (userLoading) {
        return (
            <div className="flex-1 bg-[#060f0a] rounded-2xl border border-primary/20 p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex-1 bg-[#060f0a] rounded-2xl border border-primary/20 p-8 flex items-center justify-center min-h-[400px]">
                <p className="text-red-400">Error loading user data</p>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-[#060f0a] rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
            {/* Ambient glow inside right panel */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                <div>
                    <h2 className="text-primary text-2xl font-semibold flex items-center gap-2 mb-1">
                        Settings
                    </h2>
                    <p className="text-white/50 text-sm">Manage your account settings and preferences.</p>
                </div>
            </div>

            <div className="relative z-10 grid gap-8">
                {/* Profile Photo */}
                <div className="flex flex-col gap-6 p-6 rounded-xl border border-primary/10 bg-primary/5">
                    <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
                        <User className="w-5 h-5 text-primary" />
                        <h3 className="text-white font-medium text-lg leading-tight">Profile Photo</h3>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary via-primary-glow to-primary shadow-[0_0_20px_hsl(156_70%_42%/0.4)] flex-shrink-0">
                            <div className="w-full h-full rounded-full border-4 border-[#060f0a] overflow-hidden bg-[#0a1510] relative flex items-center justify-center">
                                {user.image ? (
                                    <Image src={user.image} alt={user.name!} fill className="object-cover" />
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

                {/* Security */}
                <div className="flex flex-col gap-6 p-6 rounded-xl border border-primary/10 bg-primary/5">
                    <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
                        <Shield className="w-5 h-5 text-primary" />
                        <h3 className="text-white font-medium text-lg leading-tight">Security</h3>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                        <div className="space-y-2">
                            <Label className="text-white/70 text-sm">Current Password</Label>
                            <Input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="bg-primary/5 border-primary/20 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white/70 text-sm">New Password</Label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="bg-primary/5 border-primary/20 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white/70 text-sm">Confirm New Password</Label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="bg-primary/5 border-primary/20 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={passwordLoading}
                            className="bg-primary hover:bg-primary-glow text-white w-full sm:w-auto mt-2"
                        >
                            {passwordLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Changing Password...
                                </>
                            ) : (
                                "Change Password"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}