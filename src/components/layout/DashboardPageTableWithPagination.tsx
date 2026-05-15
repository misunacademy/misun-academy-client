import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface DashboardTablePagination {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

interface DashboardPageTableWithPaginationProps<T> {
  heading?: string;
  subheading?: string;
  filters?: ReactNode;
  actions?: ReactNode;
  columns: ReactNode[];
  data: T[];
  renderRow: (item: T, index: number) => ReactNode;
  getRowKey?: (item: T, index: number) => string;
  rowClassName?: (item: T, index: number) => string | undefined;
  pagination?: DashboardTablePagination;
  isLoading?: boolean;
  isFetching?: boolean;
  emptyState?: ReactNode;
}

const DashboardPageTableWithPagination = <T,>({
  heading,
  subheading,
  filters,
  actions,
  columns,
  data,
  renderRow,
  getRowKey,
  rowClassName,
  pagination,
  isLoading = false,
  isFetching = false,
  emptyState = "No data found.",
}: DashboardPageTableWithPaginationProps<T>) => {
  const columnCount = Math.max(columns.length, 1);
  const showLoading = isLoading || isFetching;

  return (<>
    {filters && <div className="mb-6 flex flex-wrap items-center gap-4 w-full">{filters}</div>}
    <Card>
      {(heading || subheading || actions) && (
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              {heading && (
                <CardTitle className="flex items-center">
                  {heading}
                  {showLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </CardTitle>
              )}
              {subheading && <CardDescription>{subheading}</CardDescription>}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
        </CardHeader>
      )}

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, index) => (
                <TableHead key={index}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columnCount} className="py-8 text-center text-sm text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {!isLoading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columnCount} className="py-8 text-center text-sm text-muted-foreground">
                  {emptyState}
                </TableCell>
              </TableRow>
            )}

            {!isLoading && data.map((item, index) => (
              <TableRow
                key={getRowKey ? getRowKey(item, index) : String(index)}
                className={rowClassName ? rowClassName(item, index) : undefined}
              >
                {renderRow(item, index)}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {pagination && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-2 text-sm">Page {pagination.page} of {pagination.totalPages}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={pagination.page >= pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  </>
  );
};

export default DashboardPageTableWithPagination;