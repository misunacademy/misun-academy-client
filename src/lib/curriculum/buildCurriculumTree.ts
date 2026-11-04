export type CurriculumNodeKind = 'course' | 'group' | 'module' | 'project';

export interface CurriculumTreeData {
  id: string;
  label: string;
  kind: CurriculumNodeKind;
  meta?: string;
  type?: string;
  children?: CurriculumTreeData[];
}

export interface CurriculumCourseInput {
  title: string;
  level?: string;
  modules: readonly {
    id: number | string;
    title: string;
    type?: string;
    duration?: string;
  }[];
  projects?: readonly {
    title: string;
    duration?: string;
  }[];
}

export function buildCurriculumTree(
  course: CurriculumCourseInput,
  courseIndex = 0
): CurriculumTreeData {
  const modules = course.modules ?? [];
  const projects = course.projects ?? [];
  const groups: CurriculumTreeData[] = [];

  if (modules.length > 0) {
    groups.push({
      id: `course-${courseIndex}-modules`,
      label: 'মডিউল',
      kind: 'group',
      meta: `${modules.length}টি`,
      children: modules.map((module) => ({
        id: `course-${courseIndex}-module-${module.id}`,
        label: module.title,
        kind: 'module',
        meta: module.duration,
        type: module.type,
      })),
    });
  }

  if (projects.length > 0) {
    groups.push({
      id: `course-${courseIndex}-projects`,
      label: 'প্রজেক্ট',
      kind: 'group',
      meta: `${projects.length}টি`,
      children: projects.map((project, projectIndex) => ({
        id: `course-${courseIndex}-project-${projectIndex}`,
        label: project.title,
        kind: 'project',
        meta: project.duration,
      })),
    });
  }

  return {
    id: `course-${courseIndex}`,
    label: course.title,
    kind: 'course',
    meta: course.level,
    children: groups,
  };
}
