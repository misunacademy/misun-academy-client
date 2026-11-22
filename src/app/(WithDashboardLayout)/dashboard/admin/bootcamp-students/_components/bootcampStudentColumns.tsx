import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Eye, XCircle } from "lucide-react";
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
        <Badge variant="default" className="flex w-fit items-center gap-1 bg-emerald-600 text-white">
          <CheckCircle className="h-3 w-3" />
          Paid
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

export const getBootcampStudentColumns = (
  onReview?: (purchase: BootcampPurchaseAdminItem) => void
): ColumnDef<BootcampPurchaseAdminItem>[] => [
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
    header: "Amount",
    cell: ({ row }) => {
      const isINR = row.original.currency === "INR";
      return (
        <span className="font-semibold">
          {isINR ? "₹" : "৳"}
          {Number(row.original.amount ?? 0).toLocaleString("en-US")}
        </span>
      );
    },
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      const method = row.original.method;
      if (method === "PhonePe_Manual") {
        return (
          <span className="inline-flex items-center rounded border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700">
            PhonePe
          </span>
        );
      }
      if (method === "manual") {
        return (
          <span className="inline-flex items-center rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
            Manual
          </span>
        );
      }
      return (
        <span className="inline-flex items-center rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
          SSLCommerz
        </span>
      );
    },
  },
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <span className="font-mono text-xs">{row.original.transactionId}</span>
        {row.original.senderNumber && (
          <div className="font-mono text-[11px] text-muted-foreground">
            UPI: {row.original.senderNumber}
          </div>
        )}
      </div>
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
  ...(onReview
    ? [
        {
          id: "actions",
          header: "Action",
          cell: ({ row }: { row: { original: BootcampPurchaseAdminItem } }) => {
            const isPending = row.original.status === "pending";
            return (
              <Button
                variant={isPending ? "default" : "outline"}
                size="sm"
                onClick={() => onReview(row.original)}
                className={`h-7 text-xs font-bangla ${
                  isPending
                    ? "bg-amber-600 text-white hover:bg-amber-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {isPending ? (
                  <>
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    যাচাই করুন
                  </>
                ) : (
                  "বিবরণ"
                )}
              </Button>
            );
          },
        } as ColumnDef<BootcampPurchaseAdminItem>,
      ]
    : []),
];

export const bootcampStudentColumns = getBootcampStudentColumns();
