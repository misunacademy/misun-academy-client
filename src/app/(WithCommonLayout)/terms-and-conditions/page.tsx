// app/terms-and-conditions/page.tsx
export default function TermsAndConditionsPage() {
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
                        <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">Terms &amp; </span>
                        <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">Conditions</span>
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

                    <p className="text-white/75 border-l-2 border-primary/40 pl-4">
                        <strong className="text-white/90">MISUN Academy</strong>-তে আপনাকে স্বাগতম। আমাদের ওয়েবসাইট, কোর্স, ও অন্যান্য সার্ভিস ব্যবহারের মাধ্যমে ধরে নেওয়া হচ্ছে আপনি আমাদের সমস্ত শর্তাবলি পড়ে বুঝেছেন এবং তা মেনে চলতে সম্মত হয়েছেন। এখানে &quot;আমরা&quot;, &quot;আমাদের&quot; বলতে MISUN Academy কর্তৃপক্ষ বোঝানো হয়েছে।
                    </p>
                    <p className="text-white/75 border-l-2 border-primary/40 pl-4">
                        যদি আমাদের শর্তাবলির কোনো অংশ নিয়ে আপনার কোনো প্রশ্ন বা অস্পষ্টতা থাকে, তাহলে সরাসরি আমাদের ইমেইলে বা অফিসিয়াল পেজে যোগাযোগ করুন। MISUN Academy এর টার্মস এবং কন্ডিশনস যেকোনো সময় হালনাগাদ করার অধিকার কর্তৃপক্ষ সংরক্ষণ করে।
                    </p>

                    <div className="border-t border-primary/15 pt-6">
                        <h2 className="text-xl font-semibold text-white/90 mb-6 flex items-center gap-2"><span className="w-1 h-5 rounded-full bg-primary/70 inline-block"></span> শর্তাবলি</h2>
                        <ol className="space-y-5">
                            {[
                                { title: "কোর্স কনটেন্টের অপব্যবহার কঠোরভাবে নিষিদ্ধ:", body: "আমাদের যেকোনো কোর্সের ভিডিও, টেক্সট, অথবা অন্য যেকোনো লার্নিং মেটেরিয়াল কারো সাথে বিনামূল্যে বা টাকার বিনিময়ে শেয়ার করা সম্পূর্ণ বেআইনি। কোনোভাবেই আপনার ইমেইল বা পাসওয়ার্ড অন্যের সাথে শেয়ার করা যাবে না। এটি কপিরাইট আইন ও ডিজিটাল নিরাপত্তা আইনের আওতায় অপরাধ।" },
                                { title: "একাউন্ট শুধুমাত্র আপনার জন্য:", body: "আপনার MISUN Academy অ্যাকাউন্টের তথ্য (ইউজারনেম, পাসওয়ার্ড) একান্তই আপনার ব্যক্তিগত। অন্য কাউকে ব্যবহার করতে দিলে আপনার অ্যাকাউন্ট স্থায়ীভাবে নিষ্ক্রিয় করা হতে পারে।" },
                                { title: "কনটেন্ট কপি বা পুনরায় বিতরণ:", body: "আমাদের লিখিত অনুমতি ছাড়া কোনো কোর্স কনটেন্ট হ্যান্ড-টু-হ্যান্ড, Google Drive, Facebook, YouTube, Pen Drive বা অন্য কোনো মাধ্যমে শেয়ার করা যাবে না। এতে আইনানুগ ব্যবস্থা নেয়া হতে পারে।" },
                                { title: "গ্রুপ/কমিউনিটি আচরণবিধি:", body: "আমাদের ফেসবুক গ্রুপ, চ্যাট, কমেন্ট বা ফোরামে কাউকে আক্রমণ, অপমান, হিংসাত্মক ভাষা, রাজনৈতিক আলোচনা বা স্প্যামিং একেবারেই গ্রহণযোগ্য নয়। নিয়ম ভাঙলে অ্যাকাউন্ট বাতিল হতে পারে।" },
                                { title: "কোর্স এনরোল করার আগে কোর্স কারিকুলাম জেনে নিন:", body: "কোর্সে ভর্তি হওয়ার আগে সিলেবাস ও ডিটেইলস যাচাই করে নিন। কোর্স শুরু হওয়ার পর রিফান্ড বা এক্সচেঞ্জ সম্ভব নয়।" },
                                { title: "কোর্স ট্রান্সফার নীতিমালা:", body: "একবার কোনো ইমেইলে কোর্স এক্টিভ হলে সেটি অন্য ইমেইলে ট্রান্সফার করা যাবে না। শুরু হওয়ার আগে শুধুমাত্র রেজিস্ট্রেশন ইনফো আপডেট করা যাবে।" },
                                { title: "শেখার উপকরণ কেবল ব্যক্তিগত ব্যবহারের জন্য:", body: "কোর্সের রিসোর্স (ভিডিও, লিংক, ব্লগ) কেবল ব্যক্তিগত অনুশীলনের জন্য। অন্য কোনো উদ্দেশ্যে ব্যবহার করা যাবে না।" },
                                { title: "স্প্যাম বা প্রমোশনাল কন্টেন্ট:", body: "আমাদের গ্রুপ, পেজ বা ফোরামে কোনো প্রকার বিজ্ঞাপন বা প্রমোশন চালানো যাবে না।" },
                                { title: "পেমেন্ট সম্পর্কিত সিদ্ধান্ত চূড়ান্ত:", body: "কোর্সের ফি ও পেমেন্ট পদ্ধতি বিস্তারিত পড়ে নিন। আমরা শুধুমাত্র নির্ধারিত মাধ্যম (বিকাশ মার্চেন্ট/SSLCommerz) গ্রহণ করি। অন্য মাধ্যমে পেমেন্ট করলে কর্তৃপক্ষ দায়ী নয়।" },
                                { title: "আইন মেনে চলা প্রত্যাশিত:", body: "MISUN Academy-র সকল ব্যবহারকারীর কাছ থেকে আইনসম্মত ও সম্মানজনক ব্যবহার প্রত্যাশা করা হয়। কোনো বেআইনি কার্যক্রম শনাক্ত হলে প্রয়োজনীয় আইনানুগ ব্যবস্থা নেয়া হতে পারে।" },
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4">
                                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-xs font-bold text-primary/80 mt-0.5">{i + 1}</span>
                                    <div>
                                        <strong className="text-white/85">{item.title}</strong>
                                        <br />
                                        <span className="text-white/60">{item.body}</span>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="border-t border-primary/15 pt-6">
                        <div className="rounded-xl bg-primary/5 border border-primary/15 px-6 py-5 mb-5">
                            <p className="text-white/75 text-sm leading-7">আপনার শিক্ষা যাত্রা হোক স্বচ্ছ, নিরাপদ ও ফলপ্রসূ। নিয়মগুলো মেনে চলুন, নিজেকে গড়ুন।</p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-white/45 text-sm">📩 যোগাযোগ:</span>
                            <a href="mailto:team@misun-academy.com" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary/90 text-sm font-medium hover:bg-primary/20 hover:border-primary/40 transition-all">
                                team@misun-academy.com
                            </a>
                        </div>
                        <p className="mt-5 text-primary/70 font-semibold text-sm">— Team MISUN Academy</p>
                    </div>
                </div>
            </div>
        </div>
    );
}            