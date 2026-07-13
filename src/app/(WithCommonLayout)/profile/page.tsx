"use client";

import { useAuth } from "@/hooks/useAuth";
import { useGetUserProfileQuery } from "@/redux/api/profileApi";
import { useUploadSingleImageMutation } from "@/redux/api/uploadApi";
import AuthGuard from "@/components/shared/AuthGuard";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authServerApi } from "@/lib/auth-server-api";

import { ProfileMainTab } from "@/components/module/profile/ProfileMainTab";
import { AdditionalInfoTab } from "@/components/module/profile/AdditionalInfoTab";
import { EnrollmentsTab } from "@/components/module/profile/EnrollmentsTab";
import { PaymentHistoryTab } from "@/components/module/profile/PaymentHistoryTab";
import { SettingsTab } from "@/components/module/profile/SettingsTab";
import ProfileSidebar, { NAV_ITEMS } from "./_components/ProfileSidebar";

export default function StudentProfile() {
    const { user, isLoading: sessionLoading, updateUserProfile } = useAuth();
    const { data: profileData, isLoading: profileLoading, refetch } = useGetUserProfileQuery();
    const [uploadImage, { isLoading: uploadLoading }] = useUploadSingleImageMutation();
    const [sessions, setSessions] = useState<unknown[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState("profile");

    const profile = profileData?.data;

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const result = await authServerApi.listSessions();
                if (result.error) throw new Error(result.error.message);
                if (Array.isArray(result.data)) setSessions(result.data);
            } catch (error) {
                console.error("Failed to fetch sessions", error);
            }
        };
        fetchSessions();
    }, []);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error("Please select an image smaller than 5MB."); return; }
        try {
            const formData = new FormData();
            formData.append("image", file);
            const uploadResult = await uploadImage(formData).unwrap();
            await updateUserProfile({ image: uploadResult.data.url });
            refetch();
            toast.success("Profile photo updated successfully.");
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error: unknown) {
            toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to upload photo.");
        }
    };

    const handleRevokeSession = async (token: string) => {
        try {
            const result = await authServerApi.revokeSession(token);
            if (result.error) throw new Error(result.error.message);
            setSessions(prev => prev.filter(s => (s as { token: string }).token !== token));
            toast.success("Session removed successfully");
        } catch {
            toast.error("Failed to remove session");
        }
    };

    if (sessionLoading || profileLoading) {
        return (
            <div className="flex bg-surface items-center justify-center min-h-[calc(100vh-80px)]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex bg-surface items-center justify-center min-h-[calc(100vh-80px)]">
                <p className="text-red-500">Error loading profile data</p>
            </div>
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const studentId = (user as any)?.studentId || profile?.user?.studentId || "N/A";
    const phone = profile?.user?.phone || "Not provided";
    const wpnumber = profile?.wpnumber || "Not provided";

    const updatedNavItems = NAV_ITEMS.map(item => {
        if (item.id === "additional") {
            return {
                ...item,
                completed: !!(
                    profile?.bio && profile?.dateOfBirth && profile?.address &&
                    profile?.education && profile.education.length > 0 && profile?.linkedinUrl
                ),
            };
        }
        return item;
    });

    const completedTabsCount = updatedNavItems.filter(item => item.completed).length;
    const profileCompletion = Math.round((completedTabsCount / updatedNavItems.length) * 100) || 0;

    return (
        <AuthGuard>
            <div className="min-h-[calc(100vh-80px)] bg-surface p-6 lg:p-8 font-bangla">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

                    <ProfileSidebar
                        user={user}
                        studentId={studentId}
                        phone={phone}
                        profileCompletion={profileCompletion}
                        fileInputRef={fileInputRef}
                        uploadLoading={uploadLoading}
                        handlePhotoChange={handlePhotoChange}
                        navItems={updatedNavItems}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    <div className="flex-1 min-w-0">
                        {activeTab === "profile" && (
                            <ProfileMainTab
                                profile={profile}
                                user={user}
                                studentId={studentId}
                                phone={phone}
                                wpnumber={wpnumber}
                                sessions={sessions}
                                handleRevokeSession={handleRevokeSession}
                                refetch={refetch}
                            />
                        )}
                        {activeTab === "additional" && <AdditionalInfoTab profile={profile} refetch={refetch} />}
                        {activeTab === "enrollments" && <EnrollmentsTab profile={profile} />}
                        {activeTab === "payment-history" && <PaymentHistoryTab />}
                        {activeTab === "settings" && <SettingsTab profile={profile} />}
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
