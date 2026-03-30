/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useGetUserProfileQuery } from "@/redux/features/profile/profileApi";
import { useUploadSingleImageMutation } from "@/redux/api/uploadApi";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
    Loader2, Edit, User, Info, ShoppingBagIcon,
    Settings
} from "lucide-react";
import { authServerApi } from "@/lib/auth-server-api";


// Functional Tabs
import { ProfileMainTab } from "@/components/module/profile/ProfileMainTab";
import { AdditionalInfoTab } from "@/components/module/profile/AdditionalInfoTab";
import { EnrollmentsTab } from "@/components/module/profile/EnrollmentsTab";
import {
    CertificationTab
} from "@/components/module/profile/PlaceholderTabs";
import { FaMoneyBill } from "react-icons/fa";
import { PaymentHistoryTab } from "@/components/module/profile/PaymentHistoryTab";
import { SettingsTab } from "@/components/module/profile/SettingsTab";
import EnrollmentPosterTab from "@/components/module/profile/EnrollmentPosterTab";

// Navigation items matching the screenshot
const NAV_ITEMS = [
    { id: "profile", label: "My Profile", icon: User, completed: true },
    { id: "additional", label: "Additional Info", icon: Info, completed: false }, // Will be updated dynamically
    // { id: "certification", label: "Certification", icon: Award, completed: true },
    { id: "enrollments", label: "Enrollments", icon: ShoppingBagIcon, completed: true },
    // { id: "enrollment-poster", label: "Enrollment Poster", icon: UserPlus, completed: true },
    { id: "payment-history", label: "Payment History", icon: FaMoneyBill, completed: true },
    { id: "settings", label: "Settings", icon: Settings, completed: true }
];


export default function StudentProfile() {
    const { user, isLoading: sessionLoading, updateUserProfile } = useAuth();
    const { data: profileData, isLoading: profileLoading, refetch } = useGetUserProfileQuery(undefined);
    const [uploadImage, { isLoading: uploadLoading }] = useUploadSingleImageMutation();
    const [sessions, setSessions] = useState<any[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState("profile");

    const profile = profileData?.data;

    // Fetch active sessions for the Device Activity table
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const result = await authServerApi.listSessions();
                if (result.error) {
                    throw new Error(result.error.message);
                }

                if (Array.isArray(result.data)) {
                    setSessions(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch sessions", error);
            }
        };
        fetchSessions();
    }, []);

    // Handle photo upload
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

            // The backend /profile endpoint will be called by Better Auth's session sync if needed,
            // but for BetterAuth itself we use updateUserProfile
            await updateUserProfile({
                image: uploadResult.data.url,
            });

            // Refresh our RTK Query data just in case
            refetch();

            toast.success("Profile photo updated successfully.");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to upload photo.");
        }
    };

    const handleRevokeSession = async (token: string) => {
        try {
            const result = await authServerApi.revokeSession(token);
            if (result.error) {
                throw new Error(result.error.message);
            }
            setSessions(prev => prev.filter(s => s.token !== token));
            toast.success("Session removed successfully");
        } catch (error) {
            console.log(error)
            toast.error("Failed to remove session");
        }
    };

    if (sessionLoading || profileLoading) {
        return (
            <div className="flex bg-[#060f0a] items-center justify-center min-h-[calc(100vh-80px)]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex bg-[#060f0a] items-center justify-center min-h-[calc(100vh-80px)]">
                <p className="text-red-500">Error loading profile data</p>
            </div>
        );
    }

    const studentId = (user as any)?.studentId || profile?.user?.studentId || "N/A";
    const phone = profile?.phone || user.phone || "Not provided";
    const whatsapp = profile?.whatsapp || profile?.phone || "Not provided";

    // Dynamically update completion status for NAV_ITEMS
    const updatedNavItems = NAV_ITEMS.map(item => {
        if (item.id === "additional") {
            // once merged we consider additional info complete when all sub‑sections are present
            return {
                ...item,
                completed: !!(
                    profile?.bio &&
                    profile?.dateOfBirth &&
                    profile?.address &&
                    profile?.education && profile.education.length > 0 &&
                    profile?.linkedinUrl
                ),
            };
        }
        // if (item.id === "enrollments") {
        //     return { ...item, completed: !!(profile?.enrollments && profile.enrollments.length > 0) };
        // }
        // if (item.id === "payment-history") {
        //     return { ...item, completed: !!(profile?.paymentHistory && profile.paymentHistory.length > 0) };
        // }
        return item;
    });

    const completedTabsCount = updatedNavItems.filter(item => item.completed).length;
    const profileCompletion = Math.round((completedTabsCount / updatedNavItems.length) * 100) || 0;

    return (
        <ProtectedRoute>
            <div className="min-h-[calc(100vh-80px)] bg-[#060f0a] p-6 lg:p-8 font-bangla">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

                    {/* ── Left Sidebar ────────────────────────────────────────── */}
                    <div className="w-full lg:w-[320px] flex-shrink-0 bg-[#060f0a] rounded-2xl border border-primary/20 overflow-hidden flex flex-col items-center p-6 shadow-[0_0_30px_hsl(156_70%_42%/0.05)]">

                        {/* Top right info icon */}
                        <div className="w-full flex justify-end">
                            <Info className="w-5 h-5 text-white/30 cursor-pointer hover:text-white/70 transition-colors" />
                        </div>

                        {/* Avatar Ring */}
                        <div className="relative mb-4 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-primary via-primary-glow to-primary shadow-[0_0_20px_hsl(156_70%_42%/0.4)]">
                                <div className="w-full h-full rounded-full border-4 border-[#060f0a] overflow-hidden bg-[#0a1510] relative">
                                    {user.image ? (
                                        <Image src={user.image} alt={user.name!} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-[#2A2A35] text-white/50">
                                            {user.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                    )}
                                    {/* Hover upload overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        {uploadLoading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Edit className="w-6 h-6 text-white" />}
                                    </div>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoChange}
                            />
                        </div>

                        {/* User Info */}
                        <h2 className="text-white font-semibold text-xl mb-1">{user.name}</h2>
                        <p className="text-white/50 text-xs mb-1 font-mono">{studentId}</p>
                        <p className="text-white/70 text-sm mb-1">{user.email}</p>
                        <p className="text-white/70 text-sm mb-6">{phone}</p>

                        {/* Progress Bar */}
                        <div className="w-full mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white/70 text-xs font-bangla">প্রোফাইল সম্পূর্ণ করুন</span>
                                <span className="text-primary text-xs font-semibold">{profileCompletion}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 flex overflow-hidden border border-white/5">
                                <div className="bg-gradient-to-r from-primary/50 to-primary h-full" style={{ width: `${profileCompletion}%` }} />
                            </div>
                        </div>

                        <div className="w-full border-t border-dashed border-white/10 my-2" />

                        {/* Navigation Menu */}
                        <div className="w-full flex flex-col gap-1 mt-4">
                            {updatedNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${isActive ? 'bg-primary/10 border border-primary/20 text-primary shadow-[0_0_15px_hsl(156_70%_42%/0.1)]' : 'text-white/60 hover:bg-white/5 hover:text-white/90 border border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-primary/20 text-primary' : ''}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className={`text-sm ${isActive ? 'font-medium text-primary' : ''}`}>{item.label}</span>
                                        </div>
                                        {item.completed ? (
                                            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shadow-[0_0_8px_hsl(156_70%_42%/0.5)]">
                                                <div className="w-1.5 h-1.5 rounded-sm border-b-2 border-r-2 border-white rotate-45 transform -translate-y-[1px]" />
                                            </div>
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full border border-white/30 rotate-45" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Right Content Area ────────────────────────────────────── */}
                    {activeTab === "profile" && (
                        <ProfileMainTab
                            profile={profile}
                            user={user}
                            studentId={studentId}
                            phone={phone}
                            whatsapp={whatsapp}
                            sessions={sessions}
                            handleRevokeSession={handleRevokeSession}
                            refetch={refetch}
                        />
                    )}
                    {activeTab === "additional" && <AdditionalInfoTab profile={profile} refetch={refetch} />}
                    {activeTab === "enrollment-poster" && <EnrollmentPosterTab />}
                    {activeTab === "certification" && <CertificationTab />}
                    {activeTab === "enrollments" && <EnrollmentsTab profile={profile} />}
                    {activeTab === "payment-history" && <PaymentHistoryTab profile={profile} />}
                    {activeTab === "settings" && <SettingsTab profile={profile} />}
                </div>
            </div>
        </ProtectedRoute>
    );
}