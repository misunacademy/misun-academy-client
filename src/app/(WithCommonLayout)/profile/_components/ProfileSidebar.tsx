import Image from "next/image";
import { Info, Edit, Loader2, User, ShoppingBagIcon, Settings } from "lucide-react";
import { Wallet } from "lucide-react";
import type { AuthUser } from "@/types/auth";

export interface NavItem {
    id: string;
    label: string;
    icon: typeof User;
    completed: boolean;
}

export const NAV_ITEMS: NavItem[] = [
    { id: "profile", label: "My Profile", icon: User, completed: true },
    { id: "additional", label: "Additional Info", icon: Info, completed: false },
    { id: "enrollments", label: "Enrollments", icon: ShoppingBagIcon, completed: true },
    { id: "payment-history", label: "Payment History", icon: Wallet, completed: true },
    { id: "settings", label: "Settings", icon: Settings, completed: true },
];

export default function ProfileSidebar({
    user,
    studentId,
    phone,
    profileCompletion,
    fileInputRef,
    uploadLoading,
    handlePhotoChange,
    navItems,
    activeTab,
    setActiveTab,
}: {
    user: AuthUser;
    studentId: string;
    phone: string;
    profileCompletion: number;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    uploadLoading: boolean;
    handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    navItems: NavItem[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}) {
    return (
        <div className="w-full lg:w-[320px] flex-shrink-0 bg-surface rounded-2xl border border-primary/20 overflow-hidden flex flex-col items-center p-6 shadow-[0_0_30px_hsl(156_70%_42%/0.05)]">
            <div className="w-full flex justify-end">
                <Info className="w-5 h-5 text-white/30 cursor-pointer hover:text-white/70 transition-colors" />
            </div>

            <div className="relative mb-4 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-primary via-primary-glow to-primary shadow-[0_0_20px_hsl(156_70%_42%/0.4)]">
                    <div className="w-full h-full rounded-full border-4 border-surface overflow-hidden bg-[#0a1510] relative">
                        {user.image ? (
                            <Image src={user.image} alt={user.name!} fill sizes="112px" className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-[#2A2A35] text-white/50">
                                {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            {uploadLoading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Edit className="w-6 h-6 text-white" />}
                        </div>
                    </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>

            <h2 className="text-white font-semibold text-xl mb-1">{user.name}</h2>
            <p className="text-white/50 text-xs mb-1 font-mono">{studentId}</p>
            <p className="text-white/70 text-sm mb-1">{user.email}</p>
            <p className="text-white/70 text-sm mb-6">{phone}</p>

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

            <div className="w-full mt-4">
                <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`min-w-[170px] shrink-0 flex items-center justify-between p-3 rounded-xl transition-all lg:w-full lg:min-w-0 ${
                                    isActive
                                        ? 'bg-primary/10 border border-primary/20 text-primary shadow-[0_0_15px_hsl(156_70%_42%/0.1)]'
                                        : 'text-white/60 hover:bg-white/5 hover:text-white/90 border border-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-primary/20 text-primary' : ''}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className={`whitespace-nowrap text-sm ${isActive ? 'font-medium text-primary' : ''}`}>{item.label}</span>
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
        </div>
    );
}
