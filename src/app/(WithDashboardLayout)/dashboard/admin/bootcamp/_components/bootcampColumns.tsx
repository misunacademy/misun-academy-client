import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import type { BootcampRegistration } from "@/redux/api/bootcampApi";

export const bootcampColumns = (
  getStatusBadge: (status: string) => ReactNode,
  onViewDetails: (registration: BootcampRegistration) => void,
  onDelete: (registration: BootcampRegistration) => void
): ColumnDef<BootcampRegistration>[] => [
  {
    id: "participant",
    header: "Participant",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.name}
        <div className="text-xs text-muted-foreground">{row.original.email}</div>
      </div>
    ),
  },
  {
    id: "contact",
    header: "WhatsApp",
    cell: ({ row }) =>
      row.original.whatsapp ? (
        <a
          href={`https://wa.me/88${row.original.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          {row.original.whatsapp}
        </a>
      ) : (
        "—"
      ),
  },
  {
    id: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="max-w-[220px] truncate" title={row.original.address}>
        {row.original.address}
      </div>
    ),
  },
  {
    id: "paymentLast4",
    header: "Payment (Last 4)",
    cell: ({ row }) => (
      <span className="font-mono font-semibold">{row.original.paymentLast4}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Registered",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("en-US"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => onViewDetails(row.original)}>
          <Eye className="mr-1 h-4 w-4" />
          Details
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 hover:text-red-700"
          aria-label={`Delete registration of ${row.original.name}`}
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
