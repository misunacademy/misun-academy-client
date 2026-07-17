import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProgressPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  metaPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function ProgressPagination({ page, totalPages, total, limit, metaPage, onPrevPage, onNextPage }: ProgressPaginationProps) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} students
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPrevPage} disabled={metaPage <= 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
        </div>
        <Button variant="outline" size="sm" onClick={onNextPage} disabled={metaPage >= totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
