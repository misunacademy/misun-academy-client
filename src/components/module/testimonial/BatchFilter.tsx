import { Filter, Users } from "lucide-react";

interface BatchFilterProps {
    batches: string[];
    selectedBatch: string;
    onBatchChange: (batch: string) => void;
    testimonialCounts: Record<string, number>;
}

export const BatchFilter = ({ batches, selectedBatch, onBatchChange, testimonialCounts }: BatchFilterProps) => {
    const totalCount = Object.values(testimonialCounts).reduce((a, b) => a + b, 0);

    return (
        <div className="relative overflow-hidden rounded-2xl bg-[#060f0a] border border-primary/15 p-6
            shadow-[0_0_40px_hsl(156_70%_42%/0.08)]">

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/40 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/40 rounded-tr-2xl" />
            {/* Top shimmer */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center">
                    <Filter className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold tracking-[0.1em] uppercase text-primary/80 font-bangla">ব্যাচ অনুযায়ী ফিল্টার করুন</h3>
            </div>

            <div className="flex flex-wrap gap-2.5">
                {/* All batches button */}
                <button
                    onClick={() => onBatchChange("all")}
                    className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                        transition-all duration-200
                        ${
                            selectedBatch === "all"
                                ? "bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] text-white shadow-[0_0_16px_hsl(156_70%_42%/0.35)]"
                                : "bg-[#060f0a] border border-primary/20 text-white/55 hover:border-primary/40 hover:text-white/80"
                        }`}
                >
                    <Users className="w-3.5 h-3.5" />
                    <span>সকল ব্যাচ</span>
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold
                        ${
                            selectedBatch === "all"
                                ? "bg-white/20 text-white"
                                : "bg-primary/10 text-primary/70"
                        }`}>
                        {totalCount}
                    </span>
                </button>

                {batches.map((batch) => (
                    <button
                        key={batch}
                        onClick={() => onBatchChange(batch)}
                        className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                            transition-all duration-200
                            ${
                                selectedBatch === batch
                                    ? "bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] text-white shadow-[0_0_16px_hsl(156_70%_42%/0.35)]"
                                    : "bg-[#060f0a] border border-primary/20 text-white/55 hover:border-primary/40 hover:text-white/80"
                            }`}
                    >
                        <span>{batch} ব্যাচ</span>
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold
                            ${
                                selectedBatch === batch
                                    ? "bg-white/20 text-white"
                                    : "bg-primary/10 text-primary/70"
                            }`}>
                            {testimonialCounts[batch] || 0}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};