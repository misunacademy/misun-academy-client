/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  BookOpen,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPerkGrantLogsQuery } from "@/redux/api/enrollmentPerkApi";

export default function PerkGrantLogsTable() {
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, isFetching } = useGetPerkGrantLogsQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
    search: search.trim() || undefined,
    page,
    limit,
  });

  const logs = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 15, total: 0, totalPages: 1 };

  return (
    <div className="space-y-4">
      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 bg-card rounded-xl border">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="granted">Granted</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>

          {(statusFilter !== "all" || search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter("all");
                setSearch("");
                setPage(1);
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Student</TableHead>
              <TableHead>Perk Rule</TableHead>
              <TableHead>Granted Benefit</TableHead>
              <TableHead>Source Enrollment</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[160px]">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span>Loading perk audit logs...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <BookOpen className="w-8 h-8 opacity-40" />
                    <p className="font-semibold text-foreground">No Perk Grant Logs Found</p>
                    <p className="text-xs text-muted-foreground">
                      Logs will appear here once students enroll and receive bonus perks.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => {
                const isRevoked = log.status === "revoked";
                const studentName = log.studentId?.name || "Student";
                const studentEmail = log.studentId?.email || "Unknown";
                const ruleTitle = log.ruleId?.title || "Rule";
                const isBootcamp = !!log.targetBootcampId;
                const benefitTitle = isBootcamp
                  ? `Free Bootcamp: ${log.targetBootcampId?.title}${
                      log.targetBootcampId?.season ? ` (S${log.targetBootcampId.season})` : ""
                    }`
                  : `Free ${log.targetCourseId?.title || "Course"}`;
                const sourceEnrollmentId =
                  log.sourceEnrollmentId?.enrollmentId ||
                  (log.sourceEnrollmentId as any)?._id ||
                  "-";

                return (
                  <TableRow key={log._id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="align-top py-3">
                      <div>
                        <span className="font-semibold text-foreground text-sm block">
                          {studentName}
                        </span>
                        <span className="text-xs text-muted-foreground">{studentEmail}</span>
                      </div>
                    </TableCell>

                    <TableCell className="align-top py-3 text-sm">
                      <span className="font-medium">{ruleTitle}</span>
                    </TableCell>

                    <TableCell className="align-top py-3">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                          isBootcamp
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                            : "bg-primary/10 text-primary border border-primary/20"
                        }`}
                      >
                        <BookOpen
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isBootcamp ? "text-amber-600 dark:text-amber-400" : "text-primary"
                          }`}
                        />
                        <span>{benefitTitle}</span>
                      </div>
                    </TableCell>

                    <TableCell className="align-top py-3 text-xs font-mono text-muted-foreground">
                      {sourceEnrollmentId}
                    </TableCell>

                    <TableCell className="align-top py-3">
                      <div className="space-y-1">
                        <Badge
                          variant={isRevoked ? "destructive" : "default"}
                          className={`text-[10px] gap-1 ${
                            isRevoked
                              ? "bg-destructive/15 text-destructive border border-destructive/30"
                              : "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                          }`}
                        >
                          {isRevoked ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                          {isRevoked ? "Revoked" : "Granted"}
                        </Badge>
                        {isRevoked && log.revokeReason && (
                          <p className="text-[10px] text-destructive/80 italic leading-tight">
                            {log.revokeReason}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="align-top py-3 text-xs text-muted-foreground">
                      <div>
                        {new Date(log.grantedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-[11px] opacity-70">
                        {new Date(log.grantedAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
            <div>
              Showing {logs.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
              {Math.min(page * limit, meta.total)} of {meta.total} grants
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
                className="h-8 px-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-2">
                Page {page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages || isFetching}
                className="h-8 px-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
