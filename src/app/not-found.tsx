import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gray-100">
            {/* Large Watermark */}
            <h1 className="absolute text-[20vw] md:text-[28vw] lg:text-[30vw] font-bold font-monaExpanded text-primary opacity-5 select-none">
                404
            </h1>

            <div className="text-center relative z-10">
                <h1 className="text-6xl md:text-8xl font-bold text-primary font-monaExpanded">404</h1>
                <p className="text-lg md:text-2xl text-secondary-foreground font-monaExpanded mt-2">Page Not Found</p>
                <Link href="/">
                    <Button className="mt-8">Go Back Home</Button>
                </Link>
            </div>
        </div>
    );
}
