'use client'

import { useState } from 'react'
import { courseCurriculum } from '@/data/courseCurriculum'
import { CourseSelector, StatsCard, ContentPanel } from '.'
import type { CourseConfig } from './curriculumData'

const courses = courseCurriculum.courses

interface CourseCurriculumContentProps {
  courseConfigs: readonly CourseConfig[]
}

export function CourseCurriculumContent({ courseConfigs }: CourseCurriculumContentProps) {
  const [active, setActive] = useState(0)
  const cfg = courseConfigs[active]
  const course = courses[active]

  const modules = course.modules ?? []
  const projects = course.projects ?? []
  const parse = (s: string) => parseFloat(s) || 0
  const totalHours = [...modules, ...projects].reduce((acc, m) => acc + parse(m.duration), 0)

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      <div className="flex flex-col w-full lg:w-[260px] shrink-0">
        <CourseSelector courses={courses} active={active} onSelect={setActive} configs={courseConfigs} />
        <StatsCard config={cfg} modules={modules.length} projects={projects.length} totalHours={totalHours} />
      </div>
      <ContentPanel course={course} config={cfg} modules={modules} projects={projects} />
    </div>
  )
}
