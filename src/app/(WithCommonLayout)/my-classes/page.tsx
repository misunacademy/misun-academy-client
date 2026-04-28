"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpen,
  Loader2,
  AlertCircle,
  Calendar,
  PlayCircle,
  GraduationCap,
  Sparkles,
  Video,
  Clock,
  Radio,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useGetStudentDashboardDataQuery } from "@/redux/features/student/studentApi";
import {
  Recording,
  useGetStudentRecordingsQuery,
  useIncrementRecordingViewMutation,
} from "@/redux/features/recording/recordingApi";
import { useGetCourseProgressQuery } from "@/redux/features/course/courseApi";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { YoutubePrivatePlayer } from "@/components/shared/youtube-private-player";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useRef, Suspense, useState, useMemo } from "react";
import Image from "next/image";

interface EnrolledCourse {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  thumbnailImage: string;
  shortDescription: string;
  instructor: { name: string } | null;
  batchTitle: string;
  batchNumber: string;
  enrolledAt: string;
  status: string;
  isCertificateAvailable?: boolean;
}

// ─── Three.js floating wireframe shapes ──────────────────────────────────────

function WireframeTorus({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * speed * 0.4;
    mesh.current.rotation.y += delta * speed * 0.3;
  });
  return (
    <Float speed={speed} rotationIntensity={0.8} floatIntensity={2}>
      <mesh ref={mesh} position={position}>
        <torusGeometry args={[1, 0.28, 16, 48]} />
        <meshStandardMaterial color={color} wireframe transparent opacity={0.15} />
      </mesh>
    </Float>
  );
}

function WireframeIcosa({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * speed * 0.3;
    mesh.current.rotation.z += delta * speed * 0.2;
  });
  return (
    <Float speed={speed} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh ref={mesh} position={position}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color={color} wireframe transparent opacity={0.12} />
      </mesh>
    </Float>
  );
}

function WireframeOcta({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * speed * 0.5;
    mesh.current.rotation.x += delta * speed * 0.15;
  });
  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2.5}>
      <mesh ref={mesh} position={position}>
        <octahedronGeometry args={[0.9]} />
        <meshStandardMaterial color={color} wireframe transparent opacity={0.12} />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 6, 4]} color="#22c55e" intensity={1.5} />
      <pointLight position={[-6, -4, 2]} color="#3b82f6" intensity={1} />
      <pointLight position={[0, -6, -4]} color="#a855f7" intensity={0.6} />

      {/* Left side shapes */}
      <WireframeTorus position={[-8, 2.5, -8]} color="#22c55e" speed={0.8} />
      <WireframeIcosa position={[-7.5, -3.5, -8]} color="#22c55e" speed={0.7} />
      <WireframeOcta position={[-9, 0, -11]} color="#f59e0b" speed={0.5} />

      {/* Right side shapes */}
      <WireframeTorus position={[8.5, -1.5, -9]} color="#3b82f6" speed={0.6} />
      <WireframeIcosa position={[7.5, 4, -10]} color="#a855f7" speed={1.0} />
      <WireframeOcta position={[6, -4.5, -6]} color="#3b82f6" speed={1.2} />
    </>
  );
}

function CourseCard({ enrollment }: { enrollment: EnrolledCourse }) {
  const { data: progressData } = useGetCourseProgressQuery(enrollment.courseId, {
    skip: !enrollment.courseId,
  });

  const isActive = enrollment.status === "active";
  const isCompleted = enrollment.status === "completed";
  const apiProgress = progressData?.data?.percentage;
  const progress =
    typeof apiProgress === "number"
      ? Math.min(100, Math.max(0, Math.round(apiProgress)))
      : isCompleted
      ? 100
      : 0;

  return (
    <div
      key={enrollment.id}
      className="group relative p-[1.5px] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-0.5"
    >
      {/* Spinning conic gradient border on hover */}
      <span
        className="absolute inset-[-100%] opacity-0 group-hover:opacity-100 animate-[spin_5s_linear_infinite] transition-opacity duration-800"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 20%, hsl(156 70% 42% / 0.5) 38%, hsl(156 80% 60%) 50%, hsl(156 70% 42% / 0.5) 62%, transparent 80%)",
        }}
      />
      {/* Static border when not hovered */}
      <span className="absolute inset-0 rounded-2xl border border-primary/10  group-hover:border-transparent transition-all duration-300" />

      {/* Card body */}
      <div className="relative flex flex-col sm:flex-row min-h-[160px] rounded-2xl bg-[#060f0a] overflow-hidden
        group-hover:shadow-xl group-hover:shadow-primary/10 transition-all duration-500">

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/30 rounded-tl-2xl z-10" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/30 rounded-tr-2xl z-10" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-primary/15 rounded-bl-2xl z-10" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-primary/15 rounded-br-2xl z-10" />

        {/* Thumbnail */}
        <div className="relative w-full sm:w-56 md:w-64 shrink-0 min-h-[140px] sm:min-h-0">
          {/* <CourseThumbnail title={enrollment.courseTitle} img={enrollment.thumbnailImage} /> */}
          <div className="">
            <Image src={enrollment?.thumbnailImage} alt={enrollment.courseTitle} fill  className="object-cover w-full h-full" />
          </div>
          {/* Status pill */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                isActive
                  ? "bg-primary/20 text-primary border-primary/40"
                  : isCompleted
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-400/40"
                  : "bg-white/10 text-white/60 border-white/10"
              }`}
            >
              {isCompleted && <CheckCircle2 className="w-3 h-3" />}
              {isActive ? "Active" : isCompleted ? "Completed" : enrollment.status}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col gap-3">
          {/* Background hover glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative">
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {enrollment.courseTitle}
            </h3>
            <p className="text-sm text-white/45 mt-1">
              {enrollment.instructor?.name || "Mithun Sarkar"}
              {enrollment.batchTitle ? (
                <span className="text-white/30"> • {enrollment.batchTitle}</span>
              ) : null}
            </p>
          </div>

          {enrollment.shortDescription && (
            <p className="relative text-sm text-white/35 line-clamp-2 leading-relaxed">
              {enrollment.shortDescription}
            </p>
          )}

          {/* Progress */}
          <div className="relative space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40 font-medium">Progress</span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, hsl(156 70% 42%), hsl(156 85% 65%))",
                  boxShadow: progress > 0 ? "0 0 8px hsl(156 70% 42% / 0.6)" : "none",
                }}
              />
            </div>
          </div>

          {/* Meta + Buttons row */}
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 mt-auto pt-1">
            <div className="flex items-center gap-1.5 text-xs text-white/35">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Enrolled:{" "}
                {new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              {enrollment.courseId ? (
                <Link href={`/my-classes/${enrollment.courseId}`}>
                  <button className="group/btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm
                    bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] text-white
                    shadow-[0_0_14px_hsl(156_70%_42%/0.35)] hover:shadow-[0_0_22px_hsl(156_70%_42%/0.55)]
                    transition-all duration-300 hover:-translate-y-px">
                    <PlayCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    Continue Learning
                  </button>
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm opacity-40 cursor-not-allowed bg-white/5 border border-white/10 text-white/60"
                >
                  <PlayCircle className="w-4 h-4" />
                  Unavailable
                </button>
              )}
              {/* <button
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm
                  border border-white/12 text-white/60 bg-white/4
                  hover:border-primary/40 hover:text-primary hover:bg-primary/5
                  transition-all duration-300"
                onClick={() => toast.info("Course outline coming soon!")}
              >
                <ListOrdered className="w-4 h-4" />
                Outline
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Courses Tab ──────────────────────────────────────────────────────────────

function CoursesTab({ enrolledCourses }: { enrolledCourses: EnrolledCourse[] }) {
  if (enrolledCourses.length === 0) {
    return (
      <div className="relative rounded-2xl border border-primary/20 bg-[#060f0a] overflow-hidden flex flex-col items-center justify-center py-20 gap-5 text-center px-6">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-5 rounded-2xl bg-primary/10 border border-primary/25">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <div className="relative">
          <h3 className="text-xl font-bold text-white mb-2">কোনো কোর্সে নথিভুক্ত নেই</h3>
          <p className="text-white/50 text-sm max-w-xs leading-relaxed">
            আপনি এখনো কোনো কোর্সে ভর্তি হননি। শেখা শুরু করতে কোর্সগুলো ব্রাউজ করুন।
          </p>
        </div>
        <Link href="/courses" className="relative">
          <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] text-white
            shadow-[0_0_20px_hsl(156_70%_42%/0.3)] hover:shadow-[0_0_30px_hsl(156_70%_42%/0.5)]
            transition-all duration-300 hover:-translate-y-0.5">
            Browse Courses
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {enrolledCourses.map((enrollment) => (
        <CourseCard key={enrollment.id} enrollment={enrollment} />
      ))}
    </div>
  );
}

// ── Live Recordings Tab ──────────────────────────────────────────────────────

function LiveRecordingsTab() {
  const [playingRecording, setPlayingRecording] = useState<Recording | null>(null);
  const [selectedCourseKey, setSelectedCourseKey] = useState<string>("");
  const { data: recordings = [], isLoading, isError } = useGetStudentRecordingsQuery();
  const [incrementView] = useIncrementRecordingViewMutation();

  const courseGroups = useMemo(() => {
    const grouped: Record<string, { key: string; title: string; recordings: Recording[] }> = {};

    recordings.forEach((rec) => {
      const courseObj = typeof rec.courseId === "object" ? rec.courseId : null;
      const key = courseObj?._id || (typeof rec.courseId === "string" ? rec.courseId : "live-class");
      const title = courseObj?.title || "Live Class";

      if (!grouped[key]) {
        grouped[key] = { key, title, recordings: [] };
      }
      grouped[key].recordings.push(rec);
    });

    return Object.values(grouped)
      .map((group) => ({
        ...group,
        recordings: [...group.recordings].sort(
          (a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
        ),
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [recordings]);

  const resolvedCourseKey =
    courseGroups.some((group) => group.key === selectedCourseKey)
      ? selectedCourseKey
      : (courseGroups[0]?.key || "");

  const activeCourseGroup = courseGroups.find((group) => group.key === resolvedCourseKey) || null;

  const handlePlayRecording = async (recording: Recording) => {
    setPlayingRecording(recording);
    try {
      await incrementView(recording._id).unwrap();
    } catch {
      toast.error("Could not update view count.");
    }
  };

  if (isLoading) {
    return (
      <div className="relative rounded-2xl border border-primary/20 bg-[#060f0a] overflow-hidden py-14 px-6 flex flex-col items-center justify-center gap-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-white/45">Loading live class recordings...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="border-red-500/30 bg-red-500/10 text-red-100">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load class recordings. Please try again in a moment.
        </AlertDescription>
      </Alert>
    );
  }

  if (recordings.length === 0) {
    return (
      <div className="relative rounded-2xl border border-primary/20 bg-[#060f0a] overflow-hidden flex flex-col items-center justify-center py-20 gap-5 text-center px-6">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Pulsing icon */}
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-primary/15 animate-ping opacity-20" />
          <div className="relative p-5 rounded-2xl bg-primary/10 border border-primary/25">
            <Video className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div className="relative">
          <h3 className="text-xl font-bold text-white mb-2">No Recordings Yet</h3>
          <p className="text-white/50 text-sm max-w-sm leading-relaxed">
            Live class recordings will appear here once they are uploaded after each session.
          </p>
        </div>
        <div className="relative flex items-center gap-2 text-xs text-white/30 bg-white/5 border border-primary/10 rounded-xl px-4 py-2.5">
          <Clock className="w-3.5 h-3.5 shrink-0 text-primary/60" />
          <span>Recordings are usually available within 24 hours of class</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-2 min-w-max">
            {courseGroups.map((group) => {
              const active = group.key === resolvedCourseKey;
              return (
                <button
                  key={group.key}
                  onClick={() => setSelectedCourseKey(group.key)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    active
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-primary/20 bg-[#060f0a] text-white/60 hover:border-primary/35 hover:text-white"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{group.title}</span>
                  <span className="rounded-full border border-primary/30 px-1.5 py-0.5 text-[11px] font-bold text-primary/90">
                    {group.recordings.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {activeCourseGroup ? (
          <div className="flex flex-col gap-4">
            {activeCourseGroup.recordings.map((rec) => (
              <div
                key={rec._id}
                className="group relative rounded-2xl border border-primary/20 bg-[#060f0a] p-5 flex flex-col sm:flex-row sm:items-center gap-4
                hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-14 h-14 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Radio className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white line-clamp-1">{rec.title}</h4>
                  <p className="text-sm text-white/40 line-clamp-1">{activeCourseGroup.title}</p>
                  <p className="text-xs text-white/30 mt-1">
                    {new Date(rec.sessionDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {rec.duration ? ` • ${rec.duration} min` : ""}
                  </p>
                </div>
                <button
                  onClick={() => handlePlayRecording(rec)}
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                  border border-primary/20 text-white/60 hover:border-primary/40 hover:text-primary hover:bg-primary/5
                  transition-all duration-300"
                >
                  <PlayCircle className="w-4 h-4" />
                  Watch
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <Dialog
        open={!!playingRecording}
        onOpenChange={(open) => {
          if (!open) setPlayingRecording(null);
        }}
      >
        <DialogContent className="max-w-4xl w-full bg-[#060f0a] border border-primary/25 text-white">
          <DialogHeader>
            <DialogTitle>{playingRecording?.title}</DialogTitle>
          </DialogHeader>
          {playingRecording ? (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden">
              <YoutubePrivatePlayer
                url={playingRecording.videoUrl ?? ""}
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const MyClassesPage = () => {
  const { user } = useAuth();
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error,
  } = useGetStudentDashboardDataQuery(undefined);

  const enrolledCourses: EnrolledCourse[] =
    dashboardData?.data?.enrolledCourses || [];

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

                {/* <TabsTrigger
                  value="certificates"
                  className="
                    shrink-0 whitespace-nowrap flex items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-none border-b-2 border-transparent
                    text-xs sm:text-sm font-semibold text-white/40
                    data-[state=active]:border-primary data-[state=active]:text-primary
                    data-[state=active]:bg-transparent data-[state=active]:shadow-none
                    hover:text-white/70 transition-all duration-200
                  "
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Certificates</span>
                  <span className="sm:hidden">Certificates</span>
                </TabsTrigger> */}
              </TabsList>
            </div>
          </div>

          <TabsContent value="courses" className="mt-0">
            <CoursesTab enrolledCourses={enrolledCourses} />
          </TabsContent>

          <TabsContent value="recordings" className="mt-0">
            <LiveRecordingsTab />
          </TabsContent>

          {/* <TabsContent value="certificates" className="mt-0">
            <div className="relative rounded-2xl border border-primary/20 bg-[#060f0a] overflow-hidden flex flex-col items-center justify-center py-20 gap-5 text-center px-6">
              <div
                className="absolute inset-0 opacity-[0.10] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative p-5 rounded-2xl bg-primary/10 border border-primary/25">
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
              <div className="relative">
                <h3 className="text-xl font-bold text-white mb-2">Manage Your Certificates</h3>
                <p className="text-white/50 text-sm max-w-sm leading-relaxed">
                  Request new certificates for completed courses and track approval status.
                </p>
              </div>
              <Link href="/my-classes/certificates" className="relative">
                <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm
                  bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] text-white
                  shadow-[0_0_20px_hsl(156_70%_42%/0.3)] hover:shadow-[0_0_30px_hsl(156_70%_42%/0.5)]
                  transition-all duration-300 hover:-translate-y-0.5">
                  Open Certificates
                </button>
              </Link>
            </div>
          </TabsContent> */}
        </Tabs>
      </div>
      </div>
    </ProtectedRoute>
  );
};

export default MyClassesPage;
