
import { toast } from "sonner";

const EmailVerificationModal = (
    { email: registeredEmail, onClose }: { email: string; onClose: () => void }
) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#060f0a] border border-primary/25 shadow-[0_0_60px_hsl(156_70%_42%/0.2)]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/40 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/40 rounded-tr-2xl" />
                <button onClick={onClose}
                    className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-primary/8 border border-primary/20 text-white/40 hover:text-white/80 hover:bg-primary/15 transition-all flex items-center justify-center text-lg leading-none">
                    &#x2715;
                </button>
                <div className="p-7">
                    <div className="flex justify-center mb-5">
                        <div className="relative p-[1.5px] rounded-full overflow-hidden">
                            <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                            <div className="relative w-14 h-14 rounded-full bg-[#060f0a] flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-white/90 text-center mb-1">ইমেইল যাচাই করুন</h2>
                    <p className="text-sm text-white/45 text-center mb-6">
                        আপনার অ্যাকাউন্ট সক্রিয় করতে, অনুগ্রহ করে আপনার ইমেইল যাচাই করুন।
                    </p>
                    <div className="space-y-4">
                        <div className="relative overflow-hidden rounded-xl bg-primary/6 border border-primary/20 p-4">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                            <p className="text-sm text-white/65">
                                <span className="text-white/40">ইমেইল: </span>
                                <span className="text-primary font-medium">{registeredEmail}</span>
                            </p>
                            <p className="text-sm text-white/45 mt-2 leading-relaxed">
                                আমরা আপনার ইমেইলে একটি যাচাই লিঙ্ক পাঠিয়েছি। অনুগ্রহ করে আপনার ইমেইল চেক করুন এবং লিঙ্কে ক্লিক করে আপনার অ্যাকাউন্ট যাচাই করুন।
                            </p>
                        </div>
                        <p className="text-xs text-white/35 text-center">
                            ইমেইল পাননি? স্প্যাম ফোল্ডার চেক করুন।
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={async () => { toast.info('A new verification email will be sent when you try to log in.'); }}
                                className="flex-1 py-2.5 rounded-xl border border-primary/25 text-white/55 hover:border-primary/45 hover:text-white/80 transition-all text-sm font-medium">
                                আবার পাঠান
                            </button>
                            <div className="flex-1 relative p-[1.5px] rounded-xl overflow-hidden">
                                <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                                <button onClick={onClose}
                                    className="relative w-full bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41] transition-all duration-300 text-white font-bold py-2.5 rounded-xl text-sm">
                                    লগইন করুন
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationModal;