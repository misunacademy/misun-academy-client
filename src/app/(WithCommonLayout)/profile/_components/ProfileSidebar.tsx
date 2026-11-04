import Image from "next/image";
import { Info, Edit, Loader2, User, ShoppingBagIcon, Settings } from "lucide-react";
import { Wallet } from "lucide-react";
import type { AuthUser } from "@/types/auth";
import React from "react";

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
    const [showInfo, setShowInfo] = React.useState(false);
    const infoRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
                setShowInfo(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [infoRef]);

    return (
        <div className="sm:sticky top-6 lg:sticky lg:top-6 flex-shrink-0 w-full lg:w-[320px] sm:h-[calc(100vh-120px)] flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto py-6 px-4 lg:p-6 scrollbar-thin">
                <div className="w-full flex justify-end mb-2 relative" ref={infoRef} onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)}>
                    <Info
                        className="w-5 h-5 text-white/30 cursor-pointer hover:text-white/70 transition-colors"
                        aria-label="More info"
                        onClick={() => setShowInfo(!showInfo)}
                    />
                    {showInfo && (
                        <div onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)} className="absolute right-0 mt-2 w-64 rounded-xl border border-white/10 bg-surface/95 backdrop-blur p-4 shadow-[0_0_40px_hsl(156_70%_42%/0.10)] z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                            <h4 className="text-white font-bold font-bangla mb-2 text-sm">প্রোফাইল সম্পূর্ণতা</h4>
                            <ul className="space-y-2 text-xs text-white/70 font-bangla">
                                <li className="flex justify-between">
                                    <span>নাম ও ছবি</span>
                                    <span className="text-primary">{user.name ? "সেট করা হয়েছে" : "বাকি আছে"}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>ছাত্র আইডি</span>
                                    <span className="text-primary">{studentId ? "সেট করা আছে" : "বাকি আছে"}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>ফোন নম্বর</span>
                                    <span className="text-primary">{phone ? "সেট করা আছে" : "বাকি আছে"}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>ইমেইল</span>
                                    <span className="text-primary">{user.email ? "সেট করা আছে" : "বাকি আছে"}</span>
                                </li>
                            </ul>
                            <p className="mt-3 text-[11px] text-white/50 font-bangla">
                                প্রোফাইল ১০০% সম্পূর্ণ করলে আপনি সার্টিফিকেট ও এনরোলমেন্ট ফিচার পাবেন।
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-center mb-6 cursor-pointer group" role="button" aria-label="Change profile photo" onClick={() => fileInputRef.current?.click()}>
                    <div className="relative w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-primary via-primary-glow to-primary shadow-[0_0_25px_hsl(156_70%_42%/0.5)] inline-block">
                        <div className="w-full h-full rounded-full border-4 border-surface overflow-hidden bg-surface relative">
                            {user.image ? (
                                <Image src={user.image} alt={user.name!} fill sizes="128px" className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-surface text-white/40 font-bangla font-semibold">
                                    {user.name?.charAt(0)?.toUpperCase()}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                {uploadLoading ? <Loader2 className="w-7 h-7 animate-spin text-white" /> : <Edit className="w-7 h-7 text-white" />}
                            </div>
                        </div>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </div>

                <div className="text-center mb-2">
                    <h2 className="text-white font-bold text-2xl font-bangla mb-1">{user.name}</h2>
                    <p className="text-white/50 text-xs font-mono">{studentId}</p>
                    <p className="text-white/70 text-sm mb-1">{user.email}</p>
                    <p className="text-white/70 text-sm">{phone}</p>
                </div>

                <div className="w-full mb-8 mt-2">
                    <div className="flex justify-between items-center mb-2 px-2">
                        <span className="text-white/70 text-xs font-bangla">প্রোফাইল সম্পূর্ণ করুন</span>
                        <span className="text-primary text-xs font-semibold">{profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 flex overflow-hidden border border-white/5">
                        <div className="bg-gradient-to-r from-primary via-primary-glow to-primary h-full rounded-full shadow-[0_0_15px_hsl(156_70%_42%/0.4)]" style={{ width: `${profileCompletion}%` }} />
                    </div>
                </div>

                <div className="w-full border-t border-dashed border-white/10 my-4" />

                <div className="flex sm:flex-col justify-evenly items-center gap-2 w-full mt-4 space-y-1 overflow-auto scrollbar-thin">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between gap-4 p-3 rounded-xl transition-all duration-300 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 text-primary shadow-[0_0_20px_hsl(156_70%_42%/0.15)]'
                                        : 'text-white/50 hover:bg-white/5 hover:text-white/90 hover:border-white/10 border-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                        isActive ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-white/40'
                                    }`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''} whitespace-nowrap`}>{item.label}</span>
                                </div>
                                {item.completed ? (
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-[0_0_12px_hsl(156_70%_42%/0.6)]">
                                        <div className="w-2 h-2 rounded-sm border-b-2 border-r-2 border-white rotate-45 transform -translate-y-[0.5px]" />
                                    </div>
                                ) : (
                                    <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full border border-white/30 rotate-45" />
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
