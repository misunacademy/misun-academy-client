"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Loader2, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetBootcampCatalogAdminQuery,
  useGetBootcampPurchaseStatsQuery,
  useGetBootcampPurchasesQuery,
  useLazyGetBootcampPurchasesQuery,
  type BootcampPurchaseAdminItem,
  type BootcampPurchaseQueryParams,
  type BootcampPurchaseStats,
} from "@/redux/api/bootcampApi";
import { paginateAll } from "@/lib/paginate-all";
import BootcampStudentStatsCards from "./BootcampStudentStatsCards";
import { bootcampStudentColumns } from "./bootcampStudentColumns";

type StatusFilter = "all" | "paid" | "pending" | "rejected";

// The server caps `limit` at 100, so the export walks the API one page at a
// time (strictly sequentially, never in parallel) until every page is written.
const EXPORT_PAGE_SIZE = 100;
// Safety guard: never page beyond this even if the server keeps reporting more
// pages (protects against a runaway loop while the dataset changes underneath).
const MAX_EXPORT_PAGES = 500;

const startOfDayIso = (date: string) => new Date(`${date}T00:00:00.000`).toISOString();
const endOfDayIso = (date: string) => new Date(`${date}T23:59:59.999`).toISOString();

const toExportRow = (purchase: BootcampPurchaseAdminItem, index: number) => ({
  SL: index + 1,
  Name: purchase.user?.name || "",
  Email: purchase.user?.email || "",
  Phone: purchase.user?.phone || "",
  "Student ID": purchase.user?.studentId || "",
  Address: purchase.user?.address || "",
  Bootcamp: purchase.bootcamp?.title || "",
  Season: purchase.bootcamp?.season || "",
  Status: purchase.status,
  "Amount (BDT)": purchase.amount,
  Method: purchase.method,
  "Transaction ID": purchase.transactionId,
  "Purchased At": new Date(purchase.createdAt).toLocaleString("en-US"),
});

export default function BootcampStudentsClient() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [bootcampFilter, setBootcampFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      bootcampId: bootcampFilter !== "all" ? bootcampFilter : undefined,
      from: fromDate ? startOfDayIso(fromDate) : undefined,
      to: toDate ? endOfDayIso(toDate) : undefined,
    }),
    [page, limit, search, statusFilter, bootcampFilter, fromDate, toDate]
  );

  const { data, isLoading, isFetching, refetch } = useGetBootcampPurchasesQuery(queryArgs);
  const { data: statsData } = useGetBootcampPurchaseStatsQuery(
    bootcampFilter !== "all" ? { bootcampId: bootcampFilter } : undefined
  );
  const { data: catalogData } = useGetBootcampCatalogAdminQuery({ limit: 100 });
  const [triggerExportQuery] = useLazyGetBootcampPurchasesQuery();

  const purchases = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, page, limit, totalPages: 1 };
  const stats = statsData?.data as BootcampPurchaseStats | undefined;
  const bootcamps = catalogData?.data ?? [];

  const resetToFirstPage = () => setPage(1);

  // Walks every page of the *currently filtered* list one page at a time —
  // each request is awaited before the next one starts.
  const collectAllPages = useCallback(
    (notify: (message: string) => void) =>
      paginateAll<BootcampPurchaseAdminItem, BootcampPurchaseQueryParams>(
        (args) => triggerExportQuery(args).unwrap(),
        queryArgs,
        {
          pageSize: EXPORT_PAGE_SIZE,
          maxPages: MAX_EXPORT_PAGES,
          onProgress: ({ page, totalPages, rowsSoFar }) =>
            notify(
              totalPages > 1
                ? `Exporting page ${page} of ${totalPages} — ${rowsSoFar} buyers so far...`
                : `Exporting page ${page} — ${rowsSoFar} buyers so far...`
            ),
        }
      ),
    [queryArgs, triggerExportQuery]
  );

  const handleExport = async () => {
    setIsExporting(true);
    const toastId = toast.loading("Preparing bootcamp buyer data...");
    const notify = (message: string) => toast.loading(message, { id: toastId });

    try {
      const { rows: allPurchases, pagesFetched } = await collectAllPages(notify);

      if (allPurchases.length === 0) {
        toast.error("No bootcamp buyers found for the selected filters", { id: toastId });
        return;
      }

      notify(`Generating Excel sheet for ${allPurchases.length} buyers...`);

      const XLSX = await import("xlsx");
      const rows = allPurchases.map(toExportRow);

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bootcamp Students");

      const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-");
      XLSX.writeFile(workbook, `bootcamp-students-${timestamp}.xlsx`);

      toast.success(
        `Exported ${allPurchases.length} buyers from ${pagesFetched} page${pagesFetched === 1 ? "" : "s"}`,
        { id: toastId }
      );
    } catch {
      toast.error("Failed to export bootcamp buyers", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const filtersCard = (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full space-y-2 lg:max-w-sm">
            <Label htmlFor="bootcamp-buyer-search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="bootcamp-buyer-search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Name, email, phone or transaction ID..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-auto lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="bootcamp-buyer-bootcamp">Bootcamp</Label>
              <Select
                value={bootcampFilter}
                onValueChange={(value) => {
                  setBootcampFilter(value);
                  resetToFirstPage();
                }}
              >
                <SelectTrigger id="bootcamp-buyer-bootcamp" className="w-full lg:w-[200px]">
                  <SelectValue placeholder="All Bootcamps" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bootcamps</SelectItem>
                  {bootcamps.map((bootcamp) => (
                    <SelectItem key={bootcamp._id} value={bootcamp._id}>
                      {bootcamp.title} {bootcamp.season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bootcamp-buyer-status">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as StatusFilter);
                  resetToFirstPage();
                }}
              >
                <SelectTrigger id="bootcamp-buyer-status" className="w-full lg:w-[160px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Failed / Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bootcamp-buyer-from">From</Label>
              <Input
                id="bootcamp-buyer-from"
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  resetToFirstPage();
                }}
                className="w-full lg:w-[160px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bootcamp-buyer-to">To</Label>
              <Input
                id="bootcamp-buyer-to"
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => {
                  setToDate(e.target.value);
                  resetToFirstPage();
                }}
                className="w-full lg:w-[160px]"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardPageContainer
      heading="Bootcamp Students"
      subheading="Everyone who bought a recorded bootcamp — filter, review, and export every page to Excel"
      buttons={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`mr-1 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            title="Exports every page of the filtered list, one page at a time"
          >
            {isExporting ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-1 h-4 w-4" />
            )}
            Export All Pages
          </Button>
        </div>
      }
      content={
        <>
          <BootcampStudentStatsCards
            stats={stats}
            activeStatus={statusFilter}
            onSelectStatus={(status) => {
              setStatusFilter(status);
              resetToFirstPage();
            }}
          />

          {filtersCard}

          <Card>
            <CardContent>
              <DataTable
                columns={bootcampStudentColumns}
                data={purchases}
                getRowId={(purchase) => purchase._id}
                isLoading={isLoading}
                isFetching={isFetching}
                emptyState="No bootcamp buyers found."
                pagination={{
                  page: meta.page ?? page,
                  totalPages: meta.totalPages ?? 1,
                  total: meta.total ?? 0,
                  limit: meta.limit ?? limit,
                  onPageChange: setPage,
                }}
              />
            </CardContent>
          </Card>
        </>
      }
    />
  );
}
