// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLessonNav } from '@/hooks/useLessonNav';
import type { ModuleType } from '@/hooks/useCurriculumProgress';

const curriculum: ModuleType[] = [
  {
    moduleId: 'm1',
    title: 'Module 1',
    lessons: [
      { lessonId: 'l1', title: 'Lesson 1' },
      { lessonId: 'l2', title: 'Lesson 2' },
    ],
  },
  {
    moduleId: 'm2',
    title: 'Module 2',
    lessons: [{ lessonId: 'l3', title: 'Lesson 3' }],
  },
];

describe('useLessonNav', () => {
  it('starts at the first module and lesson', () => {
    const { result } = renderHook(() => useLessonNav(curriculum));
    expect(result.current.currentModuleIndex).toBe(0);
    expect(result.current.currentLessonIndex).toBe(0);
    expect(result.current.currentModule?.moduleId).toBe('m1');
    expect(result.current.currentLessonItem?.lessonId).toBe('l1');
    expect(result.current.showCookingMessage).toBe(false);
    expect(result.current.showCongratulations).toBe(true);
  });

  it('expands all modules once curriculum loads', () => {
    const { result } = renderHook(() => useLessonNav(curriculum));
    expect(result.current.expandedModules.has('m1')).toBe(true);
    expect(result.current.expandedModules.has('m2')).toBe(true);
  });

  it('syncs indices from the currentLesson arg', () => {
    const { result } = renderHook(() =>
      useLessonNav(curriculum, { moduleId: 'm2', lessonId: 'l3' }),
    );
    expect(result.current.currentModuleIndex).toBe(1);
    expect(result.current.currentLessonIndex).toBe(0);
    expect(result.current.currentLessonItem?.lessonId).toBe('l3');
  });

  it('handlePrevLesson steps back within a module', () => {
    const { result } = renderHook(() => useLessonNav(curriculum));
    act(() => result.current.selectLesson(0, 1));
    act(() => result.current.handlePrevLesson());
    expect(result.current.currentModuleIndex).toBe(0);
    expect(result.current.currentLessonIndex).toBe(0);
  });

  it('handlePrevLesson jumps to the last lesson of the previous module', () => {
    const { result } = renderHook(() => useLessonNav(curriculum));
    act(() => result.current.selectLesson(1, 0));
    act(() => result.current.handlePrevLesson());
    expect(result.current.currentModuleIndex).toBe(0);
    // module m1 has 2 lessons, so the last index is 1
    expect(result.current.currentLessonIndex).toBe(1);
  });

  it('handlePrevLesson stays put on the very first lesson', () => {
    const { result } = renderHook(() => useLessonNav(curriculum));
    act(() => result.current.handlePrevLesson());
    expect(result.current.currentModuleIndex).toBe(0);
    expect(result.current.currentLessonIndex).toBe(0);
  });

  it('toggleModule collapses and re-expands a module', () => {
    const { result } = renderHook(() => useLessonNav(curriculum));
    expect(result.current.expandedModules.has('m1')).toBe(true);
    act(() => result.current.toggleModule('m1'));
    expect(result.current.expandedModules.has('m1')).toBe(false);
    act(() => result.current.toggleModule('m1'));
    expect(result.current.expandedModules.has('m1')).toBe(true);
  });

  it('selectLesson updates indices and clears the cooking message', () => {
    const { result } = renderHook(() => useLessonNav(curriculum));
    act(() => result.current.setShowCookingMessage(true));
    expect(result.current.showCookingMessage).toBe(true);
    act(() => result.current.selectLesson(1, 0));
    expect(result.current.currentModuleIndex).toBe(1);
    expect(result.current.currentLessonIndex).toBe(0);
    expect(result.current.showCookingMessage).toBe(false);
  });

  it('selectQuizModule moves to the module last lesson and clears the cooking message', () => {
    const { result } = renderHook(() => useLessonNav(curriculum));
    act(() => result.current.setShowCookingMessage(true));
    act(() => result.current.selectQuizModule(0));
    // already on module 0, lesson index untouched but flag cleared
    expect(result.current.currentModuleIndex).toBe(0);
    expect(result.current.showCookingMessage).toBe(false);

    act(() => result.current.selectQuizModule(1));
    expect(result.current.currentModuleIndex).toBe(1);
    expect(result.current.currentLessonIndex).toBe(0);
  });

  it('selectQuizModule ignores out-of-range modules', () => {
    const { result } = renderHook(() => useLessonNav(curriculum));
    act(() => result.current.selectQuizModule(99));
    expect(result.current.currentModuleIndex).toBe(0);
  });

  it('toggles showCongratulations via its setter', () => {
    const { result } = renderHook(() => useLessonNav(curriculum));
    act(() => result.current.setShowCongratulations(false));
    expect(result.current.showCongratulations).toBe(false);
  });
});
