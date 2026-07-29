"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { useGetAllBatchesQuery } from "@/redux/api/batchApi";
import { useGetInstructorCoursesQuery } from "@/redux/api/instructorApi";
import {
  useGetGlobalLeaderboardQuery,
  useGetCourseLeaderboardQuery,
  useGetBatchLeaderboardQuery,
} from "@/redux/api/gamificationApi";
import { LeaderboardTable } from "@/components/quiz/LeaderboardTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy } from "lucide-react";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";

interface LeaderboardPageProps {
  isInstructor?: boolean;
}

export function LeaderboardPage({ isInstructor = false }: LeaderboardPageProps) {
  const { user } = useAuth();
  const [scope, setScope] = useState<"global" | "course" | "batch">("global");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [page, setPage] = useState(1);
  const limit = 50;

  const { data: adminCourses } = useGetAllCoursesQuery({}, { skip: isInstructor });
  const { data: instructorCoursesData } = useGetInstructorCoursesQuery(undefined, { skip: !isInstructor });

  const courses = useMemo(() => {
    if (isInstructor) {
      return (instructorCoursesData as any)?.data ?? [];
    }
    return (adminCourses as any)?.data ?? [];
  }, [isInstructor, instructorCoursesData, adminCourses]);

  const { data: adminBatchesData } = useGetAllBatchesQuery(
    { courseId: selectedCourseId || undefined },
    { skip: isInstructor || !selectedCourseId }
  );

  const batches = useMemo(() => {
    if (isInstructor) {
      const course = courses.find((c: any) => c._id === selectedCourseId);
      return course?.batches ?? [];
    }
    return (adminBatchesData as any)?.data ?? [];
  }, [isInstructor, courses, selectedCourseId, adminBatchesData]);

  const globalLb = useGetGlobalLeaderboardQuery(
    { period: "all_time", page, limit },
    { skip: scope !== "global" }
  );
  const courseLb = useGetCourseLeaderboardQuery(
    { courseId: selectedCourseId, period: "all_time", page, limit },
    { skip: scope !== "course" || !selectedCourseId }
  );
  const batchLb = useGetBatchLeaderboardQuery(
    { batchId: selectedBatchId, period: "all_time", page, limit },
    { skip: scope !== "batch" || !selectedBatchId }
  );

  const lbResponse = scope === "global" ? globalLb : scope === "course" ? courseLb : batchLb;
  const { data: lbData, isLoading, isFetching } = lbResponse;
  const entries = (lbData as any)?.data ?? [];
  const totalPages = (lbData as any)?.meta?.totalPages ?? 1;
  const total = (lbData as any)?.meta?.total ?? 0;

  const isFilterReady = scope === "global" ||
    (scope === "course" && selectedCourseId) ||
    (scope === "batch" && selectedBatchId);

  const handleScopeChange = (value: string) => {
    setScope(value as any);
    setSelectedCourseId("");
    setSelectedBatchId("");
    setPage(1);
  };

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value);
    setSelectedBatchId("");
    setPage(1);
  };

  const handleBatchChange = (value: string) => {
    setSelectedBatchId(value);
    setPage(1);
  };

  return (
    <DashboardPageContainer
      heading={
        <div className="flex items-center gap-3">
          <Trophy className="h-7 w-7 text-yellow-500" />
          <span>Leaderboard</span>
        </div>
      }
      subheading="View student rankings based on Zames points earned from quizzes"
      content={
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Select value={scope} onValueChange={handleScopeChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="course">By Course</SelectItem>
                <SelectItem value="batch">By Batch</SelectItem>
              </SelectContent>
            </Select>

            {scope !== "global" && (
              <Select value={selectedCourseId} onValueChange={handleCourseChange}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c: any) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.title}
                    </SelectItem>
                  ))}
                  {courses.length === 0 && (
                    <SelectItem value="__none__" disabled>
                      No courses found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}

            {scope === "batch" && (
              <Select
                value={selectedBatchId}
                onValueChange={handleBatchChange}
                disabled={!selectedCourseId}
              >
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((b: any) => (
                    <SelectItem key={b._id} value={b._id}>
                      {b.title || `Batch #${b.batchNumber}`}
                    </SelectItem>
                  ))}
                  {batches.length === 0 && selectedCourseId && (
                    <SelectItem value="__none__" disabled>
                      No batches found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {!isFilterReady ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              {scope === "course"
                ? "Select a course to view its leaderboard"
                : scope === "batch"
                  ? "Select a course and batch to view its leaderboard"
                  : null}
            </div>
          ) : isLoading || isFetching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <LeaderboardTable
                entries={entries}
                currentUserId={user?.id || (user as any)?._id}
              />

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1}–
                    {Math.min(page * limit, total)} of {total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      }
    />
  );
}
