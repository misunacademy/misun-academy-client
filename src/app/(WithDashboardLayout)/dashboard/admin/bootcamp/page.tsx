"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Download, Inbox, Loader2, Search, XCircle } from "lucide-react";
import { toast } from "sonner";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import DashboardPageTabs from "@/components/layout/DashboardPageTabs";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useGetBootcampRegistrationsQuery,
  useLazyGetBootcampRegistrationsQuery,
  useGetBootcampStatsQuery,
  useUpdateBootcampRegistrationMutation,
  useDeleteBootcampRegistrationMutation,
  type BootcampRegistration,
} from "@/redux/api/bootcampApi";
import BootcampStatsCards from "./_components/BootcampStatsCards";
import { bootcampColumns } from "./_components/bootcampColumns";
import BootcampReviewDialog from "./_components/BootcampReviewDialog";

type StatusTab = "all" | "pending" | "verified" | "rejected";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "verified":
      return (
        <Badge variant="default" className="flex w-fit items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Verified
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive" className="flex w-fit items-center gap-1">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="flex w-fit items-center gap-1 border-amber-500/50 bg-amber-500/10 text-amber-700"
        >
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
  }
};

const escapeCsvValue = (value: string) => `"${value.replace(/"/g, '""')}"`;

const exportToCsv = (rows: BootcampRegistration[]) => {
  const header = ["Name", "Email", "WhatsApp", "Address", "Payment Last 4", "Status", "Registered At"];
  const lines = rows.map((row) =>
    [
      row.name,
      row.email,
      row.whatsapp || "",
      row.address,
      row.paymentLast4,
      row.status,
      new Date(row.createdAt).toLocaleString("en-US"),
    ]
      .map(escapeCsvValue)
      .join(",")
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bootcamp-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default function BootcampManagementPage() {
  const [activeTab, setActiveTab] = useState<StatusTab>("pending");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [selectedRegistration, setSelectedRegistration] = useState<BootcampRegistration | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BootcampRegistration | null>(null);
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: statsData } = useGetBootcampStatsQuery();
  const { data, isLoading, isFetching, refetch } = useGetBootcampRegistrationsQuery({
    status: activeTab,
    search: search || undefined,
    page,
    limit,
  });

  const [fetchForExport, { isFetching: isExporting }] = useLazyGetBootcampRegistrationsQuery();
  const [updateRegistration, { isLoading: isUpdating }] = useUpdateBootcampRegistrationMutation();
  const [deleteRegistration, { isLoading: isDeleting }] = useDeleteBootcampRegistrationMutation();

  const registrations = data?.data || [];
  const meta = data?.meta ?? { total: 0, page: 1, limit, totalPages: 1 };
  const stats = statsData?.data;

  const openReviewDialog = (registration: BootcampRegistration) => {
    setSelectedRegistration(registration);
    setAdminNote(registration.adminNote || "");
    setReviewDialogOpen(true);
  };

  const handleUpdateStatus = async (id: string, status: "verified" | "rejected") => {
    try {
      await updateRegistration({ id, data: { status, adminNote: adminNote || undefined } }).unwrap();
      toast.success(status === "verified" ? "Registration verified" : "Registration rejected");
      setReviewDialogOpen(false);
      setSelectedRegistration(null);
      setAdminNote("");
    } catch {
      toast.error("Failed to update registration");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRegistration(deleteTarget._id).unwrap();
      toast.success("Registration deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete registration");
    }
  };

  const handleExport = async () => {
    try {
      const result = await fetchForExport({ status: "all", limit: 500 }, true).unwrap();
      if (!result.data.length) {
        toast.error("No registrations to export");
        return;
      }
      exportToCsv(result.data);
      toast.success(`CSV exported (${result.data.length} rows)`);
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        (error as Error)?.message ||
        "Export failed";
      toast.error(message);
    }
  };

  const handleSelectTab = (tab: StatusTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const tabTriggers = [
    { value: "pending", label: `Pending (${stats?.pending ?? 0})` },
    { value: "verified", label: `Verified (${stats?.verified ?? 0})` },
    { value: "rejected", label: `Rejected (${stats?.rejected ?? 0})` },
    { value: "all", label: `All (${stats?.total ?? 0})` },
  ];

  const emptyState = (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </span>
      <p className="font-medium">
        {search
          ? `No registrations match "${search}"`
          : activeTab === "rejected"
            ? "No rejected registrations."
            : activeTab === "verified"
              ? "No verified registrations yet."
              : activeTab === "all"
                ? "No registrations yet."
                : "No pending registrations."}
      </p>
      {!search && (
        <p className="max-w-sm text-sm text-muted-foreground">
          New registrations from the /bootcamp page will appear here.
        </p>
      )}
    </div>
  );

  const tableContent = (
    <Card>
      <CardContent className="pt-6">
        <DataTable
          columns={bootcampColumns(getStatusBadge, openReviewDialog, setDeleteTarget)}
          data={registrations}
          getRowId={(registration) => registration._id}
          isFetching={isFetching}
          emptyState={emptyState}
          pagination={{ page, totalPages: meta.totalPages, total: meta.total, limit, onPageChange: setPage }}
        />
      </CardContent>
    </Card>
  );

  const tabContents = tabTriggers.map((tab) => ({
    value: tab.value,
    content: tableContent,
  }));

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <DashboardPageContainer
      heading="Bootcamp Registrations"
      subheading="Manage Paracetamol For Photoshop bootcamp participants"
      buttons={
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <Loader2 className={`mr-1 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      }
      content={
        <>
          <BootcampStatsCards stats={stats} activeTab={activeTab} onSelectTab={handleSelectTab} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search name, email, WhatsApp..."
                className="pl-9"
                aria-label="Search bootcamp registrations"
              />
            </div>
            <Button variant="outline" onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-1 h-4 w-4" />
              )}
              Export CSV
            </Button>
          </div>

          <DashboardPageTabs
            value={activeTab}
            onValueChange={(value) => handleSelectTab(value as StatusTab)}
            triggers={tabTriggers}
            contents={tabContents}
          />

          <BootcampReviewDialog
            open={reviewDialogOpen}
            onOpenChange={setReviewDialogOpen}
            registration={selectedRegistration}
            adminNote={adminNote}
            onAdminNoteChange={setAdminNote}
            onVerify={(id) => handleUpdateStatus(id, "verified")}
            onReject={(id) => handleUpdateStatus(id, "rejected")}
            isUpdating={isUpdating}
            getStatusBadge={getStatusBadge}
          />

          <AlertDialog
            open={!!deleteTarget}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete registration?</AlertDialogTitle>
                <AlertDialogDescription>
                  {deleteTarget &&
                    `This will permanently remove the registration of ${deleteTarget.name} (${deleteTarget.email}). This action cannot be undone.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  disabled={isDeleting}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  {isDeleting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      }
    />
  );
}
