"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ShieldCheck, SearchX } from "lucide-react";
import {
  useGetAuditLogsQuery,
  type AuditLogEntry,
} from "@/redux/api/auditLogApi";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";

const filterSchema = z.object({
  action: z.string().optional(),
  actor: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

function formatMetadata(metadata?: Record<string, unknown>): string {
  if (!metadata || Object.keys(metadata).length === 0) return "—";
  return Object.entries(metadata)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(", ");
}

function ActionBadge({ action }: { action: string }) {
  const tone =
    action.includes("delete") || action.includes("reject")
      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
      : action.includes("status") || action.includes("update")
        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${tone}`}>
      {action}
    </span>
  );
}

function AuditLogTable() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>({});

  const { data, isLoading, isError } = useGetAuditLogsQuery({
    page,
    limit: 20,
    ...filters,
  });

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { action: "", actor: "", from: "", to: "" },
  });

  const onSubmit = (values: FilterValues) => {
    setPage(1);
    setFilters({
      action: values.action || undefined,
      actor: values.actor || undefined,
      from: values.from || undefined,
      to: values.to || undefined,
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "createdAt",
        header: "Time",
        cell: ({ row }: { row: { original: AuditLogEntry } }) => (
          <span className="whitespace-nowrap text-xs">
            {row.original.createdAt ? format(new Date(row.original.createdAt), "dd MMM yyyy HH:mm") : "—"}
          </span>
        ),
      },
      {
        id: "actor",
        header: "Actor",
        cell: ({ row }: { row: { original: AuditLogEntry } }) => (
          <span className="text-xs">
            {row.original.actor ? `${row.original.actor.name} (${row.original.actor.role ?? "?"})` : "system"}
          </span>
        ),
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }: { row: { original: AuditLogEntry } }) => (
          <ActionBadge action={row.original.action} />
        ),
      },
      {
        id: "target",
        header: "Target",
        cell: ({ row }: { row: { original: AuditLogEntry } }) => (
          <span className="max-w-[180px] truncate text-xs" title={row.original.targetId}>
            {row.original.targetType}
            {row.original.targetId ? ` · ${row.original.targetId.slice(-6)}` : ""}
          </span>
        ),
      },
      {
        id: "details",
        header: "Details",
        cell: ({ row }: { row: { original: AuditLogEntry } }) => (
          <span className="block max-w-[280px] truncate text-xs text-muted-foreground" title={formatMetadata(row.original.metadata)}>
            {formatMetadata(row.original.metadata)}
          </span>
        ),
      },
    ],
    []
  );

  const items = data?.items ?? [];
  const meta = data?.meta;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <SearchX className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Failed to load audit logs. Please try again.
        </p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50/50 rounded-xl">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
        aria-label="Audit log filters"
      >
        <Input placeholder="Action (e.g. user.delete)" aria-label="Action" {...form.register("action")} />
        <Input placeholder="Actor ID" aria-label="Actor ID" {...form.register("actor")} />
        <Input placeholder="From date" type="date" aria-label="From date" {...form.register("from")} />
        <Input placeholder="To date" type="date" aria-label="To date" {...form.register("to")} />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Apply filters
        </Button>
      </form>
      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        getRowId={(row: AuditLogEntry) => row._id}
        emptyState={
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <ShieldCheck className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No audit entries found.</p>
          </div>
        }
        pagination={
          meta && meta.totalPages > 1
            ? {
                page: meta.page,
                totalPages: meta.totalPages,
                total: meta.total,
                limit: 20,
                onPageChange: setPage,
              }
            : undefined
        }
      />
    </div>
  );
}

export default function AuditLogsContent() {
  return (
    <DashboardPageContainer
      heading="Audit Logs"
      subheading="Security-relevant actions across the platform. Superadmin only."
      content={<AuditLogTable />}
    />
  );
}
