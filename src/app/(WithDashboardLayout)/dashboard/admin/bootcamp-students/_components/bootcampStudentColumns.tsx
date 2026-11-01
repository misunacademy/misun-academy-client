import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import type { BootcampPurchaseAdminItem } from "@/redux/api/bootcampApi";

const toWaMe = (value: string): string => {
  const cleaned = value.replace(/[^\d+]/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("+")) return cleaned.slice(1);
  if (cleaned.startsWith("0")) return `88${cleaned}`;
  return cleaned;
};

export const getBootcampPurchaseStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return (
        <Badge variant="default" className="flex w-fit items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Paid
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive" className="flex w-fit items-center gap-1">
          <XCircle className="h-3 w-3" />
          Failed
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

export const bootcampStudentColumns: ColumnDef<BootcampPurchaseAdminItem>[] = [
  {
    id: "buyer",
    header: "Buyer",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.user?.name || "N/A"}
        <div className="text-xs text-muted-foreground">{row.original.user?.email || "—"}</div>
      </div>
    ),
  },
  {
    id: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.user?.phone;
      if (!phone) return "—";
      const waNumber = toWaMe(phone);
      return waNumber ? (
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          {phone}
        </a>
      ) : (
        phone
      );
    },
  },
  {
    id: "bootcamp",
    header: "Bootcamp",
    cell: ({ row }) => (
      <div className="max-w-[240px] truncate" title={`${row.original.bootcamp?.title ?? ""} ${row.original.bootcamp?.season ?? ""}`}>
        {row.original.bootcamp?.title || "N/A"}
        {row.original.bootcamp?.season ? (
          <span className="ml-1 text-xs text-muted-foreground">{row.original.bootcamp.season}</span>
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount (৳)",
    cell: ({ row }) => `৳${Number(row.original.amount ?? 0).toLocaleString("en-US")}`,
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => (row.original.method === "manual" ? "Manual" : "SSLCommerz"),
  },
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.transactionId}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Purchased",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("en-US"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getBootcampPurchaseStatusBadge(row.original.status),
  },
];
