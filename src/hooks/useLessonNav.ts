import { useState, useEffect, startTransition } from "react";
import type { ModuleType } from "./useCurriculumProgress";

export function useLessonNav(curriculum: ModuleType[], currentLesson?: { moduleId: string; lessonId: string }) {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showCookingMessage, setShowCookingMessage] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!currentLesson || !curriculum.length) return;
    const moduleIndex = curriculum.findIndex((m) => m.moduleId === currentLesson.moduleId);
    const lessonIndex = curriculum[moduleIndex]?.lessons.findIndex((l) => l.lessonId === currentLesson.lessonId);
    startTransition(() => {
      if (moduleIndex >= 0) setCurrentModuleIndex(moduleIndex);
      if (lessonIndex >= 0) setCurrentLessonIndex(lessonIndex);
    });
  }, [currentLesson, curriculum]);

  useEffect(() => {
    if (!curriculum.length) return;
    startTransition(() => {
      setExpandedModules(new Set(curriculum.map((m) => m.moduleId)));
    });
  }, [curriculum]);

  const currentModule = curriculum?.[currentModuleIndex];
  const currentLessonItem = currentModule?.lessons[currentLessonIndex];

  const handlePrevLesson = () => {
    if (!currentModule) return;
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      const prevModule = curriculum[currentModuleIndex - 1] as ModuleType;
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(prevModule.lessons.length - 1);
    }
  };

  const toggleModule = (moduleId: string) =>
    setExpandedModules((prev) => {
      const s = new Set(prev);
      if (s.has(moduleId)) s.delete(moduleId);
      else s.add(moduleId);
      return s;
    });

  const selectLesson = (moduleIdx: number, lessonIdx: number) => {
    setCurrentModuleIndex(moduleIdx);
    setCurrentLessonIndex(lessonIdx);
    setShowCookingMessage(false);
  };

  return {
    currentModuleIndex,
    currentLessonIndex,
    currentModule,
    currentLessonItem,
    showCookingMessage,
    showCongratulations,
    expandedModules,
    setCurrentModuleIndex,
    setCurrentLessonIndex,
    handlePrevLesson,
    toggleModule,
    selectLesson,
    setShowCookingMessage,
    setShowCongratulations,
  };
}
