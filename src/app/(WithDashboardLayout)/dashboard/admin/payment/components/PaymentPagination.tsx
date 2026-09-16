import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaymentPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  rowCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function PaymentPagination({ page, totalPages, total, rowCount, onPrevPage, onNextPage }: PaymentPaginationProps) {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-gray-600">Showing {rowCount} of {total} payments</div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onPrevPage} disabled={page === 1} className="border-gray-300" aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-gray-600">Page {page} of {totalPages}</span>
        <Button variant="outline" size="sm" onClick={onNextPage} disabled={page === totalPages} className="border-gray-300" aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
