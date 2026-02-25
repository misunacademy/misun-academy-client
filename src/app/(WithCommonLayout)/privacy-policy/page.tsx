// app/privacy-policy/page.tsx
export default function PrivacyPolicyPage() {
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

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 mb-20">
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
                        <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">Privacy </span>
                        <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">Policy</span>
                    </h1>
                    <p className="text-sm text-white/35">Last updated: 19 July, 2025</p>
                </div>

                {/* Card */}
                <div className="relative overflow-hidden rounded-2xl bg-[#0a1610] border border-primary/20 shadow-[0_0_80px_hsl(156_70%_42%/0.12)] p-8 md:p-10 leading-8 space-y-6 text-white/70 font-bangla">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                  <div className="absolute -top-6 left-0 w-5 h-5 border-t border-l border-primary/40 rounded-tl-2xl" />
                    <div className="absolute -top-6 right-0 w-5 h-5 border-t border-r border-primary/40 rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-primary/25 rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-primary/25 rounded-br-2xl" />

                    <p className="text-white/75 border-l-2 border-primary/40 pl-4">
                        <strong className="text-white/90">MISUN Academy</strong>-তে স্বাগতম। আপনার আস্থাই আমাদের সবচেয়ে বড় শক্তি। MISUN Academy পরিবারে যুক্ত হবার জন্য আপনাকে আন্তরিক ধন্যবাদ।
                    </p>

                    <p className="text-white/75 border-l-2 border-primary/40 pl-4">
                        MISUN Academy-তে আমরা আপনার ব্যক্তিগত তথ্যের নিরাপত্তা ও গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। আপনি যখন আমাদের ওয়েবসাইট বা সার্ভিস ব্যবহার করেন, তখন আপনি আমাদের উপর আস্থা রেখে আপনার তথ্য শেয়ার করেন। সেই আস্থার মর্যাদা দিতে আমরা স্পষ্টভাবে জানাতে চাই—আমরা কী ধরণের তথ্য সংগ্রহ করি, কীভাবে তা ব্যবহার করি এবং আপনার কী অধিকার রয়েছে।
                    </p>

                    <p className="text-white/75 border-l-2 border-primary/40 pl-4">
                        অনুগ্রহ করে আমাদের এই গোপনীয়তা নীতিমালাটি মনোযোগ দিয়ে পড়ুন। কোনো প্রশ্ন বা উদ্বেগ থাকলে, অনুগ্রহ করে যোগাযোগ করুন —{" "}
                        <a href="mailto:team@misun-academy.com" className="text-primary/80 hover:text-primary underline underline-offset-2 transition-colors">
                            team@misun-academy.com
                        </a>
                        ।
                    </p>

                    <div className="border-t border-primary/15 pt-6">
                        <h2 className="text-xl font-semibold text-white/90 mb-4 flex items-center gap-2"><span className="w-1 h-5 rounded-full bg-primary/70 inline-block"></span> আমরা কোন তথ্য সংগ্রহ করি?</h2>

                        <h3 className="text-base font-semibold text-primary/80 mt-5 mb-2">১। আপনি যে তথ্য আমাদের দেন</h3>
                        <ul className="list-disc pl-6 space-y-1.5 text-white/60 marker:text-primary/60">
                            <li>ব্যক্তিগত পরিচয় সংক্রান্ত তথ্য: নাম, ইমেইল, মোবাইল নম্বর, ঠিকানা, পাসওয়ার্ড ইত্যাদি।</li>
                            <li>লেনদেন সম্পর্কিত তথ্য: কার্ড নাম্বার, পেমেন্ট গেটওয়ে ডেটা ইত্যাদি।</li>
                            <li>সোশ্যাল মিডিয়া তথ্য: ফেসবুক বা গুগল লগইনের মাধ্যমে প্রাপ্ত তথ্য।</li>
                        </ul>
                        <p className="mt-3">
                            দয়া করে নিশ্চিত করুন, আপনি যে তথ্য আমাদের দেন তা সত্য, সম্পূর্ণ ও হালনাগাদ। কোনো পরিবর্তন হলে অনতিবিলম্বে আমাদের জানানো আপনার দায়িত্ব।
                        </p>

                        <h3 className="text-base font-semibold text-primary/80 mt-5 mb-2">২। স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য</h3>
                        <ul className="list-disc pl-6 space-y-1.5 text-white/60 marker:text-primary/60">
                            <li>আপনার ডিভাইস ও অপারেটিং সিস্টেম</li>
                            <li>ব্রাউজারের ধরন</li>
                            <li>আইপি অ্যাড্রেস</li>
                            <li>আপনার ভিজিট সময়, অবস্থান ও ওয়েবসাইট ব্যবহারের ধরন</li>
                        </ul>
                        <p className="mt-3">এই তথ্য আমাদের ওয়েবসাইটের নিরাপত্তা, পারফরম্যান্স বিশ্লেষণ ও উন্নয়নের জন্য ব্যবহৃত হয়।</p>
                    </div>

                    <div className="border-t border-primary/15 pt-6">
                        <h2 className="text-xl font-semibold text-white/90 mb-4 flex items-center gap-2"><span className="w-1 h-5 rounded-full bg-primary/70 inline-block"></span> আমরা আপনার তথ্য কীভাবে ব্যবহার করি?</h2>
                        <ul className="list-disc pl-6 space-y-1.5 text-white/60 marker:text-primary/60">
                            <li>কোর্স ও সার্ভিস প্রদান</li>
                            <li>ইউজার এক্সপেরিয়েন্স উন্নয়ন</li>
                            <li>নিরাপত্তা ও প্রযুক্তিগত সহায়তা প্রদান</li>
                            <li>আপনার সাথে যোগাযোগ রাখা</li>
                            <li>অভ্যন্তরীণ বিশ্লেষণ ও গবেষণা</li>
                        </ul>
                    </div>

                    <div className="border-t border-primary/15 pt-6">
                        <h2 className="text-xl font-semibold text-white/90 mb-3 flex items-center gap-2"><span className="w-1 h-5 rounded-full bg-primary/70 inline-block"></span> কুকিজের ব্যবহার</h2>
                        <p>হ্যাঁ, আমরা কুকিজ ও অন্যান্য ট্র্যাকিং টুল ব্যবহার করি যাতে আপনার ব্রাউজিং অভিজ্ঞতা আরও উন্নত হয় এবং ওয়েবসাইটটি আপনার জন্য আরও উপযোগী হয়। আপনি চাইলে ব্রাউজার সেটিংস থেকে কুকিজ নিয়ন্ত্রণ করতে পারেন।</p>
                    </div>

                    <div className="border-t border-primary/15 pt-6">
                        <h2 className="text-xl font-semibold text-white/90 mb-3 flex items-center gap-2"><span className="w-1 h-5 rounded-full bg-primary/70 inline-block"></span> নীতিমালার পরিবর্তন</h2>
                        <p>আমরা সময় ও প্রয়োজন অনুযায়ী এই গোপনীয়তা নীতিমালা হালনাগাদ করতে পারি। গুরুত্বপূর্ণ পরিবর্তন হলে আমরা ওয়েবসাইটে তা স্পষ্টভাবে জানিয়ে দেব।</p>
                    </div>

                    <div className="border-t border-primary/15 pt-6">
                        <h2 className="text-xl font-semibold text-white/90 mb-3 flex items-center gap-2"><span className="w-1 h-5 rounded-full bg-primary/70 inline-block"></span> যোগাযোগ করুন</h2>
                        <p>
                            যদি আপনার কোনো প্রশ্ন, মতামত বা অভিযোগ থাকে, তাহলে অনুগ্রহ করে আমাদের ইমেইল করুন —{" "}
                            <a href="mailto:team@misun-academy.com" className="text-primary/80 hover:text-primary underline underline-offset-2 transition-colors">
                                team@misun-academy.com
                            </a>
                            ।
                        </p>
                    </div>

                    <div className="border-t border-primary/15 pt-6">
                        <p className="text-white/80 font-semibold">আপনার উপর আস্থাই আমাদের অনুপ্রেরণা। MISUN Academy-তে আপনাকে স্বাগতম ও অভিনন্দন!</p>
                        <p className="text-primary/70 font-semibold mt-1">— Team MISUN Academy</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
