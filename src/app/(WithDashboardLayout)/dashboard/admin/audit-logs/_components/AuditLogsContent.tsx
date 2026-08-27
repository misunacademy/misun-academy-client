"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  useGetAuditLogsQuery,
  type AuditLogEntry,
} from "@/redux/api/auditLogApi";
import AuthGuard from "@/components/shared/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, SearchX, ChevronLeft, ChevronRight } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

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

  const items = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
        aria-label="Audit log filters"
      >
        <Input placeholder="Action (e.g. user.delete)" aria-label="Action" {...form.register("action")} />
        <Input placeholder="Actor ID" aria-label="Actor" {...form.register("actor")} />
        <Input type="date" aria-label="From date" {...form.register("from")} />
        <Input type="date" aria-label="To date" {...form.register("to")} />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Apply filters
        </Button>
      </form>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <ShieldCheck className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No audit entries found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((entry: AuditLogEntry) => (
                <TableRow key={entry._id}>
                  <TableCell className="whitespace-nowrap text-xs">
                    {entry.createdAt ? format(new Date(entry.createdAt), "dd MMM yyyy HH:mm") : "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {entry.actor ? `${entry.actor.name} (${entry.actor.role ?? "?"})` : "system"}
                  </TableCell>
                  <TableCell>
                    <ActionBadge action={entry.action} />
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate text-xs" title={entry.targetId}>
                    {entry.targetType}
                    {entry.targetId ? ` · ${entry.targetId.slice(-6)}` : ""}
                  </TableCell>
                  <TableCell className="max-w-[280px] truncate text-xs text-muted-foreground" title={formatMetadata(entry.metadata)}>
                    {formatMetadata(entry.metadata)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {meta.page} of {meta.totalPages} · {meta.total} entries
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuditLogsContent() {
  return (
    <AuthGuard requiredRoles={["superadmin"]}>
      <div className="container mx-auto space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground text-sm">
            Security-relevant actions across the platform. Superadmin only.
          </p>
        </div>
        <AuditLogTable />
      </div>
    </AuthGuard>
  );
}
