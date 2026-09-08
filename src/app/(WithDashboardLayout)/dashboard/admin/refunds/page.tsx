"use client"

import { useMemo, useState } from "react"
import { Plus, RotateCcw } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardPageContainer from "@/components/layout/DashboardPageContainer"
import { RefundCreateDialog } from "@/components/module/refund/RefundCreateDialog"
import { useGetRefundsQuery, type Refund, type RefundStatus } from "@/redux/api/refundApi"
import { RefundActions, statusVariant } from "./_components/RefundActions"

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
]

export default function AdminRefundsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [createOpen, setCreateOpen] = useState(false)

  const { data, isLoading, isError } = useGetRefundsQuery(
    statusFilter === "all" ? { limit: 50 } : { status: statusFilter as RefundStatus, limit: 50 }
  )
  const refunds = data?.data ?? []

  const columns = useMemo(
    () => [
      {
        accessorKey: "transactionId",
        header: "Transaction",
        cell: ({ row }: { row: { original: Refund } }) => (
          <span className="font-mono text-xs">{row.original.transactionId}</span>
        ),
      },
      {
        id: "student",
        header: "Student",
        cell: ({ row }: { row: { original: Refund } }) => (
          <div>
            <p>{row.original.student?.name || "N/A"}</p>
            <p className="text-[12px] text-muted-foreground">{row.original.student?.email || "N/A"}</p>
          </div>
        ),
      },
      {
        id: "course",
        header: "Course",
        cell: ({ row }: { row: { original: Refund } }) => row.original.course?.title || "N/A",
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }: { row: { original: Refund } }) => (
          <span className="font-medium">
            {row.original.amount.toFixed(2)} {row.original.currency}
          </span>
        ),
      },
      {
        accessorKey: "channel",
        header: "Channel",
        cell: ({ row }: { row: { original: Refund } }) => (
          <Badge variant="outline" className="capitalize">
            {row.original.channel}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: { original: Refund } }) => (
          <Badge variant={statusVariant(row.original.status)} className="capitalize">
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Requested",
        cell: ({ row }: { row: { original: Refund } }) => new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: { original: Refund } }) => <RefundActions refund={row.original} />,
      },
    ],
    []
  )

  return (
    <>
      <DashboardPageContainer
      heading="Refunds"
      subheading="Request, review and complete payment refunds. Completing a refund marks the payment refunded and revokes the enrollment."
      buttons={
        <Button onClick={() => setCreateOpen(true)} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">New Refund</span>
        </Button>
      }
      content={
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading refunds…</p>
          ) : isError ? (
            <p className="py-8 text-center text-sm text-destructive">Failed to load refunds.</p>
          ) : (
            <DataTable
              columns={columns}
              data={refunds}
              emptyState="No refunds found."
              getRowId={(row: Refund) => row._id}
            />
          )}
        </div>
      }
    />
      <RefundCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}