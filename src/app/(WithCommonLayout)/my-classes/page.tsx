"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpen,
  AlertCircle,
  Video,
  GraduationCap,
  Sparkles,
  KeyRound,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { CoursesTab } from "./components/CoursesTab";
import { LiveRecordingsTab } from "./components/LiveRecordingsTab";
import { SpecialAccessTab } from "./components/SpecialAccessTab";
import { EnrolledCourse } from "./types";
import { useGetStudentDashboardDataQuery } from "@/redux/api/dashboardApi";

// Dynamically import the Scene component with no SSR to avoid blocking the main thread
const Scene = dynamic(() => import('./components/ThreeDScene').then(mod => mod.Scene), {
  ssr: false,
});

const MyClassesPage = () => {
  const { user } = useAuth();
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error,
  } = useGetStudentDashboardDataQuery(undefined);

  const allCourses: EnrolledCourse[] = dashboardData?.data?.enrolledCourses || [];
  const enrolledCourses = allCourses.filter(
    (course) => course.accessType !== "special"
  );
  const specialAccessCourses = allCourses.filter(
    (course) => course.accessType === "special"
  );

  if (dashboardLoading) {
    return (
      <div
        className="relative min-h-[60vh] flex flex-col items-center justify-center gap-4"
        style={{ background: "linear-gradient(180deg, #0a0f18 0%, #060f0a 100%)" }}
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-white/40 text-sm">Loading your classes…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6" style={{ background: "#060f0a" }}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load your courses. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] ?? "Student";

  return (
    <ProtectedRoute>
      <div
        className="relative min-h-screen overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0a0f18 0%, #060f0a 60%, #040c07 100%)",
        }}
      >
        {/* ── Three.js 3D background canvas ── */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true, antialias: true }}>
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
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

          {/* ── Welcome Banner ── */}
          <div className="relative p-[1.5px] rounded-2xl overflow-hidden">
            {/* Subtle spinning border on banner */}
            <span
              className="absolute inset-[-100%] animate-[spin_8s_linear_infinite] opacity-50"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 30%, hsl(156 70% 42% / 0.4) 50%, transparent 70%)",
              }}
            />
            <div className="relative rounded-2xl bg-[#060f0a] border border-primary/10 p-6 sm:p-8 overflow-hidden">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-transparent pointer-events-none" />

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/20 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/20 rounded-br-2xl" />

              <div className="relative flex items-center gap-4">
                {/* Icon badge */}
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0d5c36] via-primary to-[#0a5f38]
                flex items-center justify-center shadow-lg shadow-primary/40">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/70 mb-0.5">
                    Welcome back
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {firstName}
                    <span
                      className="ml-2 font-medium text-xl sm:text-2xl"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      — Ready for your next lesson?
                    </span>
                  </h1>
                </div>
              </div>

              {enrolledCourses.length > 0 && (
                <div className="relative mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs text-white/60">
                    You have{" "}
                    <span className="font-bold text-primary">{enrolledCourses.length}</span>{" "}
                    enrolled course{enrolledCourses.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

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
    </ProtectedRoute>
  );
};

export default MyClassesPage;
