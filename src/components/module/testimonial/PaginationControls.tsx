import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const PaginationControls = ({ currentPage, totalPages, onPageChange }: PaginationControlsProps) => {
    const getVisiblePages = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            const end = Math.min(totalPages, start + maxVisible - 1);
            if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    const visiblePages = getVisiblePages();

    const btnBase = "inline-flex items-center justify-center h-9 min-w-[36px] px-3 rounded-xl text-sm font-medium transition-all duration-200 border";
    const btnInactive = `${btnBase} bg-[#060f0a] border-primary/20 text-white/55 hover:border-primary/45 hover:text-white/85`;
    const btnActive = `${btnBase} bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] border-transparent text-white shadow-[0_0_14px_hsl(156_70%_42%/0.4)]`;
    const btnDisabled = `${btnBase} bg-[#060f0a] border-primary/10 text-white/20 cursor-not-allowed`;

    return (
        <div className="flex items-center justify-center gap-1.5 mt-12">
            {/* Prev */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={currentPage <= 1 ? btnDisabled : btnInactive}
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">পূর্ববর্তী</span>
            </button>

            <div className="flex gap-1.5">
                {visiblePages[0] > 1 && (
                    <>
                        <button onClick={() => onPageChange(1)} className={btnInactive}>1</button>
                        {visiblePages[0] > 2 && (
                            <span className="flex items-center px-1 text-white/30 text-sm">…</span>
                        )}
                    </>
                )}

                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={page === currentPage ? btnActive : btnInactive}
                    >
                        {page}
                    </button>
                ))}

                {visiblePages[visiblePages.length - 1] < totalPages && (
                    <>
                        {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                            <span className="flex items-center px-1 text-white/30 text-sm">…</span>
                        )}
                        <button onClick={() => onPageChange(totalPages)} className={btnInactive}>{totalPages}</button>
                    </>
                )}
            </div>

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={currentPage >= totalPages ? btnDisabled : btnInactive}
            >
                <span className="hidden sm:inline mr-1">পরবর্তী</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};
