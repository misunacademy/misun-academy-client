import { Button } from "@/components/ui/button";
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
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            const end = Math.min(totalPages, start + maxVisible - 1);

            if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex items-center justify-center space-x-2 mt-12">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="transition-all duration-200 hover:shadow-testimonial"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">পূর্ববর্তী</span>
            </Button>

            <div className="flex space-x-1">
                {visiblePages[0] > 1 && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(1)}
                            className="transition-all duration-200"
                        >
                            1
                        </Button>
                        {visiblePages[0] > 2 && (
                            <span className="flex items-center px-2">...</span>
                        )}
                    </>
                )}

                {visiblePages.map((page) => (
                    <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        className={`transition-all duration-200 ${page === currentPage
                            ? "shadow-glow"
                            : "hover:shadow-testimonial"
                            }`}
                    >
                        {page}
                    </Button>
                ))}

                {visiblePages[visiblePages.length - 1] < totalPages && (
                    <>
                        {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                            <span className="flex items-center px-2 text-muted-foreground">...</span>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(totalPages)}
                            className="transition-all duration-200 hover:shadow-testimonial"
                        >
                            {totalPages}
                        </Button>
                    </>
                )}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="transition-all duration-200 hover:shadow-testimonial"
            >
                <span className="hidden sm:inline mr-1">পরবর্তী</span>
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
};