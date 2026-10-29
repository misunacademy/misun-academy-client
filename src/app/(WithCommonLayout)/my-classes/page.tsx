"use client";

import { Skeleton } from 'boneyard-js/react'
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpen,
  AlertCircle,
  Video,
  KeyRound,
  Flame,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/shared/AuthGuard";
import dynamic from "next/dynamic";
import { EnrolledCourse } from "./types";
import { useGetStudentDashboardDataQuery } from "@/redux/api/dashboardApi";
import WelcomeBanner from "./_components/WelcomeBanner";

const CursorGrid = dynamic(() => import("./components/CursorGrid"), { ssr: false });

const CoursesTab = dynamic(() => import("./components/CoursesTab").then(m => ({ default: m.CoursesTab })), { ssr: false });
const BootcampsTab = dynamic(() => import("./components/BootcampsTab").then(m => ({ default: m.BootcampsTab })), { ssr: false });
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
      <div className="relative isolate min-h-screen overflow-hidden bg-[#040a07]">
        <div className="absolute inset-0 z-0 bg-[#040a07]"
          // style={{
          //   backgroundImage:
          //     "linear-gradient(rgba(32, 180, 134, 0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(32, 180, 134, 0.14) 1px, transparent 1px), radial-gradient(circle at 50% 0%, rgba(32, 180, 134, 0.18), transparent 42%)",
          //   backgroundSize: "48px 48px, 48px 48px, 100% 100%",
          // }}
        />

        <CursorGrid
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1,
            width: '100%',
            height: '100%',
          }}
          cellSize={30}
          color="#20b486"
          gridColor="#2b5b54"
          highlight="area"
          gridStyle="lines"
          radius={90}
          holdTime={400}
          fadeDuration={800}
          fillOpacity={0.12}
          gridOpacity={0.15}
          spotlight={0.6}
          clickPulse
        />

        {/* ── Content ── */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
              <WelcomeBanner firstName={firstName} enrolledCourses={enrolledCourses} />

              {/* ── Tabs ── */}
              <Tabs defaultValue="courses" className="space-y-6">
                {/* Tab bar */}
                <div className="relative bg-black rounded-md">
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
                        value="bootcamps"
                        className="
                        shrink-0 whitespace-nowrap flex items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-none border-b-2 border-transparent
                        text-xs sm:text-sm font-semibold text-white/40
                        data-[state=active]:border-primary data-[state=active]:text-primary
                        data-[state=active]:bg-transparent data-[state=active]:shadow-none
                        hover:text-white/70 transition-all duration-200
                      "
                      >
                        <Flame className="w-4 h-4" />
                        <span className="hidden sm:inline">My Bootcamps</span>
                        <span className="sm:hidden">Bootcamps</span>
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

                <TabsContent value="bootcamps" className="mt-0">
                  <BootcampsTab />
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
