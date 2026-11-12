"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Edit2,
  Trash2,
  Users,
  Search,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Gift,
  Loader2,
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  EnrollmentPerkRule,
  useDeletePerkRuleMutation,
  useGetPerkRulesQuery,
  useTogglePerkRuleStatusMutation,
} from "@/redux/api/enrollmentPerkApi";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { useGetAllBatchesQuery } from "@/redux/api/batchApi";
import BackfillConfirmDialog from "./BackfillConfirmDialog";

interface PerkRulesTableProps {
  onEditRule: (rule: EnrollmentPerkRule) => void;
}

export default function PerkRulesTable({ onEditRule }: PerkRulesTableProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<EnrollmentPerkRule | null>(null);

  const [backfillDialogOpen, setBackfillDialogOpen] = useState(false);
  const [ruleForBackfill, setRuleForBackfill] = useState<EnrollmentPerkRule | null>(null);

  const { data: coursesData } = useGetAllCoursesQuery({});
  const courses = coursesData?.data || [];

  const { data: batchesData } = useGetAllBatchesQuery(
    { courseId: courseFilter === "all" ? undefined : courseFilter },
    { skip: courseFilter === "all" }
  );
  const batches = batchesData?.data || [];

  const { data, isLoading, isFetching } = useGetPerkRulesQuery({
    courseId: courseFilter === "all" ? undefined : courseFilter,
    batchId: batchFilter === "all" ? undefined : batchFilter,
    isActive: statusFilter === "all" ? undefined : statusFilter,
    search: search.trim() || undefined,
    page,
    limit,
  });

  const [toggleStatus] = useTogglePerkRuleStatusMutation();
  const [deleteRule, { isLoading: isDeleting }] = useDeletePerkRuleMutation();

  const rules = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const handleToggle = async (rule: EnrollmentPerkRule, currentStatus: boolean) => {
    try {
      await toggleStatus({ id: rule._id, isActive: !currentStatus }).unwrap();
      toast.success(`Rule "${rule.title}" ${!currentStatus ? "activated" : "deactivated"}`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const confirmDelete = async () => {
    if (!ruleToDelete) return;
    try {
      await deleteRule(ruleToDelete._id).unwrap();
      toast.success("Perk rule deleted successfully");
      setDeleteDialogOpen(false);
      setRuleToDelete(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete rule");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-4 bg-card rounded-xl border">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search rules by title or notes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Course filter */}
          <Select
            value={courseFilter}
            onValueChange={(val) => {
              setCourseFilter(val);
              setBatchFilter("all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course._id} value={course._id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Batch filter */}
          <Select
            value={batchFilter}
            onValueChange={(val) => {
              setBatchFilter(val);
              setPage(1);
            }}
            disabled={courseFilter === "all"}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Batches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {batches.map((batch) => (
                <SelectItem key={batch._id} value={batch._id}>
                  {batch.title} {batch.batchNumber ? `(#${batch.batchNumber})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {(courseFilter !== "all" || statusFilter !== "all" || search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCourseFilter("all");
                setBatchFilter("all");
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

      {/* Rules Table */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[240px]">Rule & Enrolled Scope</TableHead>
              <TableHead>Configured Benefits</TableHead>
              <TableHead className="w-[150px]">Validity / Schedule</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[120px]">Created</TableHead>
              <TableHead className="text-right w-[160px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span>Loading perk rules...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground max-w-sm mx-auto">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                      <Gift className="w-8 h-8" />
                    </div>
                    <p className="font-semibold text-foreground">No Perk Rules Found</p>
                    <p className="text-xs text-muted-foreground">
                      Create your first enrollment perk rule to grant automatic bonuses when students enroll in a course + batch.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rules.map((rule) => {
                const courseTitle =
                  typeof rule.courseId === "object" ? rule.courseId?.title : "Course";
                const batchTitle =
                  typeof rule.batchId === "object"
                    ? `${rule.batchId?.title}${rule.batchId?.batchNumber ? ` (#${rule.batchId?.batchNumber})` : ""}`
                    : "Batch";

                return (
                  <TableRow key={rule._id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="align-top py-3">
                      <div className="space-y-1">
                        <span className="font-semibold text-foreground text-sm block leading-tight">
                          {rule.title}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/80">{courseTitle}</span>
                          <span className="text-muted-foreground/60"> • </span>
                          <span>{batchTitle}</span>
                        </div>
                        {rule.note && (
                          <p className="text-[11px] text-muted-foreground italic line-clamp-1">
                            Note: {rule.note}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="align-top py-3">
                      <div className="space-y-1.5">
                        {rule.benefits?.map((benefit, idx) => {
                          const isBootcamp = benefit.type === "free_bootcamp";
                          const targetTitle = isBootcamp
                            ? typeof benefit.targetBootcampId === "object"
                              ? `${benefit.targetBootcampId?.title}${
                                  benefit.targetBootcampId?.season
                                    ? ` (S${benefit.targetBootcampId.season})`
                                    : ""
                                }`
                              : "Bootcamp"
                            : typeof benefit.targetCourseId === "object"
                            ? benefit.targetCourseId?.title
                            : "Course";

                          const durationLabel = isBootcamp
                            ? "Lifetime Access"
                            : benefit.accessDuration?.type === "days"
                            ? `${benefit.accessDuration.days} Days Access`
                            : "Lifetime Access";

                          return (
                            <div
                              key={idx}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium mr-1.5 mb-1 ${
                                isBootcamp
                                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                                  : "bg-primary/10 text-primary border border-primary/20"
                              }`}
                            >
                              <Sparkles
                                className={`w-3 h-3 shrink-0 ${
                                  isBootcamp ? "text-amber-600 dark:text-amber-400" : "text-primary"
                                }`}
                              />
                              <span>
                                {isBootcamp ? "Free Bootcamp: " : "Free "}
                                {targetTitle}
                              </span>
                              <span
                                className={`text-[10px] ${
                                  isBootcamp
                                    ? "text-amber-700/70 dark:text-amber-400/70"
                                    : "text-primary/70"
                                }`}
                              >
                                ({durationLabel})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </TableCell>

                    <TableCell className="align-top py-3 text-xs">
                      {rule.startDate || rule.endDate ? (
                        <div className="space-y-0.5 text-muted-foreground">
                          {rule.startDate && (
                            <div>
                              From: {new Date(rule.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                          )}
                          {rule.endDate && (
                            <div>
                              Until: {new Date(rule.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/70 italic flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Always active
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="align-top py-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => handleToggle(rule, rule.isActive)}
                          aria-label="Toggle active status"
                        />
                        <Badge
                          variant={rule.isActive ? "default" : "secondary"}
                          className={`text-[10px] ${
                            rule.isActive
                              ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {rule.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell className="align-top py-3 text-xs text-muted-foreground">
                      {new Date(rule.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell className="align-top py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Apply to existing enrolled students"
                          onClick={() => {
                            setRuleForBackfill(rule);
                            setBackfillDialogOpen(true);
                          }}
                          className="h-8 w-8 text-primary hover:bg-primary/10"
                        >
                          <Users className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit Perk Rule"
                          onClick={() => onEditRule(rule)}
                          className="h-8 w-8 text-foreground/80 hover:bg-muted"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete Perk Rule"
                          onClick={() => {
                            setRuleToDelete(rule);
                            setDeleteDialogOpen(true);
                          }}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Server-side Pagination footer */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
            <div>
              Showing {rules.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
              {Math.min(page * limit, meta.total)} of {meta.total} rules
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

      {/* Delete Rule Confirmation Alert */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Perk Rule?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{ruleToDelete?.title}&quot;? Future students enrolling
              in this batch will no longer receive this perk. Previously granted perks remain intact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete Rule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Backfill Dialog */}
      <BackfillConfirmDialog
        open={backfillDialogOpen}
        onOpenChange={setBackfillDialogOpen}
        rule={ruleForBackfill}
      />
    </div>
  );
}
