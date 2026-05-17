"use client";

import { useRef, useState, ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Loader2, Camera, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { authServerApi } from "@/lib/auth-server-api";
import { useAuth } from "@/hooks/useAuth";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/redux/api/settingsApi";
import { useUploadSingleImageMutation } from "@/redux/api/uploadApi";
import { useUpdateUserProfileMutation } from "@/redux/api/profileApi";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";


const SettingsPage = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [uploadImage, { isLoading: uploadLoading }] = useUploadSingleImageMutation();
    const profileFileInputRef = useRef<HTMLInputElement>(null);

    const { user, updateUserProfile } = useAuth();
    const [updateProfile, { isLoading: profileUpdateLoading }] = useUpdateUserProfileMutation();

    const handleProfilePhotoClick = () => {
        profileFileInputRef.current?.click();
    };

    const handleProfilePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
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

            const result = await uploadImage(formData).unwrap();

            await updateProfile({ avatar: result.data.url }).unwrap();
            await updateUserProfile({ image: result.data.url });

            toast.success("Profile photo updated successfully.");
            if (profileFileInputRef.current) profileFileInputRef.current.value = "";
        } catch (error) {
            console.error("Profile upload error", error);
            toast.error("Failed to upload profile photo.");
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

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

        setPasswordLoading(true);
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
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            let errorMessage = "Failed to change password.";
            if (error && typeof error === "object") {
                if ("data" in error) {
                    const apiError = error as { data?: { message?: string } };
                    errorMessage = apiError.data?.message || errorMessage;
                } else if ("message" in error) {
                    const generalError = error as { message: string };
                    errorMessage = generalError.message;
                }
            }
            toast.error(errorMessage);
        } finally {
            setPasswordLoading(false);
        }
    };
    return (

        <DashboardPageContainer
            heading="Settings"
            subheading="Manage your account settings"
            content={
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Photo
                            </CardTitle>
                            <CardDescription>Update your profile picture.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? undefined} />
                                    <AvatarFallback>{user?.name?.split(" ")?.map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) ?? "U"}</AvatarFallback>
                                </Avatar>
                                <div className="sm:flex justify-between items-center w-full ">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{user?.name}</p>
                                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleProfilePhotoClick}
                                        disabled={uploadLoading || profileUpdateLoading}
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
                                    <input
                                        ref={profileFileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleProfilePhotoChange}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Change Password
                            </CardTitle>
                            <CardDescription>Update your admin password securely.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div className="space-y-2 relative">
                                    <Label htmlFor="current-password">Current password</Label>
                                    <Input
                                        id="current-password"
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="Enter your current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword((s) => !s)}
                                        className="absolute right-3 top-[38px] text-muted-foreground"
                                        aria-label="Toggle current password visibility"
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                <div className="space-y-2 relative">
                                    <Label htmlFor="new-password">New password</Label>
                                    <Input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        placeholder="At least 6 characters"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword((s) => !s)}
                                        className="absolute right-3 top-[38px] text-muted-foreground"
                                        aria-label="Toggle new password visibility"
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                <div className="space-y-2 relative">
                                    <Label htmlFor="confirm-password">Confirm new password</Label>
                                    <Input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        placeholder="Repeat new password"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((s) => !s)}
                                        className="absolute right-3 top-[38px] text-muted-foreground"
                                        aria-label="Toggle confirm password visibility"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                <Button type="submit" disabled={passwordLoading}>
                                    {passwordLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Changing...
                                        </>
                                    ) : (
                                        "Change Password"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            }
        />

    );
};

export default SettingsPage;