import Link from "next/link";
import { BookOpen, Home } from "lucide-react";
import PageBackground from "@/components/shared/PageBackground";

export default function NotFoundPage() {
    return (
        <PageBackground gradient="bg-surface" dotOpacity="opacity-[0.05]">
            <main className="flex min-h-screen items-center justify-center px-4 py-16">
                <div className="max-w-lg text-center">
                    <p className="font-monaExpanded text-6xl font-bold tracking-tight text-primary-glow sm:text-7xl">
                        404
                    </p>
                    <h1 className="mt-4 font-bangla text-2xl font-bold text-white sm:text-3xl">
                        পেজটি খুঁজে পাওয়া যায়নি
                    </h1>
                    <p className="mt-3 font-bangla text-base leading-relaxed text-white/75">
                        আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে, নাম বদলেছে অথবা লিংকটি ভুল।
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/"
                            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bangla text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
                        >
                            <Home className="h-4 w-4" aria-hidden />
                            হোমে ফিরুন
                        </Link>
                        <Link
                            href="/course-details"
                            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-primary/25 bg-white/[0.04] px-6 py-3 font-bangla text-sm font-semibold text-white/90 transition-colors hover:border-primary/45 hover:bg-white/[0.07] sm:w-auto"
                        >
                            <BookOpen className="h-4 w-4" aria-hidden />
                            কোর্স দেখুন
                        </Link>
                    </div>
                </div>
            </main>
        </PageBackground>
    );
}
