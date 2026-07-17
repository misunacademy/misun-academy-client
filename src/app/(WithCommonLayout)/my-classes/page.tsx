"use client";

import { Skeleton } from 'boneyard-js/react'
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpen,
  AlertCircle,
  Video,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/shared/AuthGuard";
import dynamic from "next/dynamic";
import { EnrolledCourse } from "./types";
import { useGetStudentDashboardDataQuery } from "@/redux/api/dashboardApi";
import WelcomeBanner from "./_components/WelcomeBanner";

const SceneBackground = dynamic(
  () => import("./components/ClassesSceneBackground"),
  { ssr: false }
)

const CoursesTab = dynamic(() => import("./components/CoursesTab").then(m => ({ default: m.CoursesTab })), { ssr: false });
const LiveRecordingsTab = dynamic(() => import("./components/LiveRecordingsTab").then(m => ({ default: m.LiveRecordingsTab })), { ssr: false });
const SpecialAccessTab = dynamic(() => import("./components/SpecialAccessTab").then(m => ({ default: m.SpecialAccessTab })), { ssr: false });

const MyClassesPage = () => {
  const { user } = useAuth();
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error,
  } = useGetStudentDashboardDataQuery(undefined);

  const allCourses = (dashboardData?.data?.enrolledCourses ?? []) as EnrolledCourse[];
  const enrolledCourses = allCourses.filter(
    (course) => course.accessType !== "special"
  );
  const specialAccessCourses = allCourses.filter(
    (course) => course.accessType === "special"
  );

  const firstName = user?.name?.split(" ")[0] ?? "Student";

  return (
    <AuthGuard>
      <Skeleton name="MyClassesPage" loading={dashboardLoading}>
      {error ? (
        <div className="p-6 bg-surface">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load your courses. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
      <div
        className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0f18] via-surface to-surface-darker"
      >
        {/* ── Three.js 3D background canvas ── */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <SceneBackground />
        </div>

        {/* ── Global dot-grid texture ── */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none z-[1]"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* ── Top ambient glow ── */}
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-[20%] -left-24 w-[280px] h-[280px] bg-primary/6 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-[30%] -right-20 w-[220px] h-[220px] bg-primary/5 rounded-full blur-[70px] pointer-events-none" />

        {/* ── Spinning ring decorations ── */}
        <div className="absolute top-[5%] left-[8%] w-32 h-32 border-[6px] border-primary/8 rounded-full animate-[spin_30s_linear_infinite] pointer-events-none blur-sm z-[1]" />
        <div className="absolute bottom-[15%] right-[5%] w-52 h-52 border-[10px] border-primary/5 rounded-full animate-[spin_50s_linear_infinite_reverse] pointer-events-none blur-md z-[1]" />

        {/* ── Content ── */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">

          <WelcomeBanner firstName={firstName} enrolledCourses={enrolledCourses} />

          {/* ── Tabs ── */}
          <Tabs defaultValue="courses" className="space-y-6">
            {/* Tab bar */}
            <div className="relative">
              {/* Divider line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
              <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <TabsList className="h-auto p-0 bg-transparent rounded-none min-w-max w-max sm:w-full justify-start gap-0">
                  <TabsTrigger
                    value="courses"
                    className="
                    shrink-0 whitespace-nowrap flex items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-none border-b-2 border-transparent
                    text-xs sm:text-sm font-semibold text-white/40
                    data-[state=active]:border-primary data-[state=active]:text-primary
                    data-[state=active]:bg-transparent data-[state=active]:shadow-none
                    hover:text-white/70 transition-all duration-200
                  "
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">My Courses</span>
                    <span className="sm:hidden">Courses</span>
                    {enrolledCourses.length > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/20 text-primary border border-primary/30">
                        {enrolledCourses.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="recordings"
                    className="
                    shrink-0 whitespace-nowrap flex items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-none border-b-2 border-transparent
                    text-xs sm:text-sm font-semibold text-white/40
                    data-[state=active]:border-primary data-[state=active]:text-primary
                    data-[state=active]:bg-transparent data-[state=active]:shadow-none
                    hover:text-white/70 transition-all duration-200
                  "
                  >
                    <Video className="w-4 h-4" />
                    <span className="hidden sm:inline">Live Class Recordings</span>
                    <span className="sm:hidden">Recordings</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="special-access"
                    className="
                    shrink-0 whitespace-nowrap flex items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-none border-b-2 border-transparent
                    text-xs sm:text-sm font-semibold text-white/40
                    data-[state=active]:border-primary data-[state=active]:text-primary
                    data-[state=active]:bg-transparent data-[state=active]:shadow-none
                    hover:text-white/70 transition-all duration-200
                  "
                  >
                    <KeyRound className="w-4 h-4" />
                    <span className="hidden sm:inline">Special Access</span>
                    <span className="sm:hidden">Special</span>
                    {specialAccessCourses.length > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/20 text-primary border border-primary/30">
                        {specialAccessCourses.length}
                      </span>
                    )}
                  </TabsTrigger>


                </TabsList>
              </div>
            </div>

            <TabsContent value="courses" className="mt-0">
              <CoursesTab enrolledCourses={enrolledCourses} />
            </TabsContent>

            <TabsContent value="recordings" className="mt-0">
              <LiveRecordingsTab />
            </TabsContent>
            
            <TabsContent value="special-access" className="mt-0">
              <SpecialAccessTab courses={specialAccessCourses} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      )}
      </Skeleton>
    </AuthGuard>
  );
};

export default MyClassesPage;
