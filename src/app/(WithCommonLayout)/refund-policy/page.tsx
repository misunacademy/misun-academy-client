// app/refund-policy/page.tsx
export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-[#060f0a] relative overflow-hidden">
            {/* Dot-grid */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />
            <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-primary/7 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 mb-16">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                        </span>
                        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">MISUN Academy</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-3">
                        <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">Refund </span>
                        <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">Policy</span>
                    </h1>
                    <p className="text-sm text-white/35">Last Update: 19 July, 2025</p>
                </div>

                {/* Card */}
                <div className="relative overflow-hidden rounded-2xl bg-[#0a1610] border border-primary/20 shadow-[0_0_80px_hsl(156_70%_42%/0.12)] p-8 md:p-10 leading-8 space-y-6 text-white/70 font-bangla">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                   <div className="absolute -top-6 left-0 w-5 h-5 border-t border-l border-primary/40 rounded-tl-2xl" />
                    <div className="absolute -top-6 right-0 w-5 h-5 border-t border-r border-primary/40 rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-primary/25 rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-primary/25 rounded-br-2xl" />

                    <p className="text-white/75 border-l-2 border-primary/40 pl-4">আমাদের রিফান্ড নীতি বোঝা একদমই সহজ। আমরা চাই যাতে আপনি স্বচ্ছতা ও আত্মবিশ্বাসের সঙ্গে কোর্সে যুক্ত হতে পারেন।</p>

                    <div className="border-t border-primary/15 pt-6">
                        <h2 className="text-xl font-semibold text-white/90 mb-3 flex items-center gap-2"><span className="w-1 h-5 rounded-full bg-primary/70 inline-block"></span> রিফান্ডের সময়সীমা</h2>
                        <p>
                            আপনি যদি কোনো কোর্স কিনে থাকেন, তাহলে <strong className="text-white/85">কেনার পর প্রথম ২৪ ঘণ্টার মধ্যে</strong> রিফান্ডের জন্য আবেদন করা যাবে। এই সময়সীমার পরে করা রিফান্ড রিকোয়েস্ট গ্রহণযোগ্য হবে না।
                        </p>
                    </div>

                    <div className="border-t border-primary/15 pt-6">
                        <h2 className="text-xl font-semibold text-white/90 mb-3 flex items-center gap-2"><span className="w-1 h-5 rounded-full bg-primary/70 inline-block"></span> রিফান্ড আবেদন প্রক্রিয়া</h2>
                        <p className="mb-4">রিফান্ড পেতে চাইলে আপনাকে আমাদের ইমেইলে আবেদন পাঠাতে হবে। আবেদন পাঠাতে নিচের তথ্য উল্লেখ করে একটি ইমেইল করুন:</p>
                        <ul className="list-disc pl-6 space-y-1.5 text-white/60 marker:text-primary/60">
                            <li>আপনার নাম ও ইমেইল ঠিকানা (যা দিয়ে রেজিস্ট্রেশন করেছেন)</li>
                            <li>কোর্সের নাম</li>
                            <li>পেমেন্টের তারিখ ও মাধ্যম</li>
                            <li>রিফান্ডের কারণ</li>
                        </ul>
                        <p className="mt-4">
                            ইমেইল পাঠাতে ব্যবহার করুন:{" "}
                            <a href="mailto:team@misun-academy.com" className="text-primary/80 hover:text-primary underline underline-offset-2 transition-colors">
                                team@misun-academy.com
                            </a>
                        </p>
                    </div>

                    <div className="border-t border-primary/15 pt-6">
                        <h2 className="text-xl font-semibold text-white/90 mb-3 flex items-center gap-2"><span className="w-1 h-5 rounded-full bg-primary/70 inline-block"></span> রিভিউ ও যোগাযোগ</h2>
                        <p>আমাদের টিম রিফান্ড আবেদন পাওয়ার পর সাধারণত <strong className="text-white/85">২ থেকে ৩ কার্যদিবসের মধ্যে</strong> আপনার সাথে যোগাযোগ করবে। প্রয়োজনে অতিরিক্ত তথ্য চাওয়া হতে পারে।</p>
                    </div>

                    <div className="border-t border-primary/15 pt-6">
                        <h2 className="text-xl font-semibold text-white/90 mb-3 flex items-center gap-2"><span className="w-1 h-5 rounded-full bg-primary/70 inline-block"></span> অর্থ ফেরত প্রক্রিয়া</h2>
                        <p>রিফান্ড যদি অনুমোদিত হয়, তাহলে অর্থ ফেরত <strong className="text-white/85">৫ থেকে ১০ কার্যদিবসের মধ্যে</strong> প্রক্রিয়া সম্পন্ন হবে। ফেরত যেই পেমেন্ট মাধ্যম ব্যবহার করে করা হয়েছিল, সেখানেই অর্থ পাঠানো হবে।</p>
                    </div>

                    <div className="border-t border-primary/15 pt-6">
                        <p className="text-white/80 font-semibold">আপনার সন্তুষ্টি আমাদের কাছে গুরুত্বপূর্ণ। তাই দয়া করে সিদ্ধান্ত নেওয়ার আগে কোর্স সম্পর্কে বিস্তারিত জেনে নিন এবং রিফান্ডের সময়সীমা মাথায় রাখুন।</p>
                        <p className="mt-3">
                            📩 যোগাযোগের জন্য ইমেইল করুন:{" "}
                            <a href="mailto:team@misun-academy.com" className="text-primary/80 hover:text-primary underline underline-offset-2 transition-colors">
                                team@misun-academy.com
                            </a>
                        </p>
                        <p className="mt-4 text-primary/70 font-semibold">— Team MISUN Academy</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
//       