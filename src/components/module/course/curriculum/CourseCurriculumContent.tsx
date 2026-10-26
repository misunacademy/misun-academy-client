'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { GitBranch, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { courseCurriculum } from '@/data/courseCurriculum'
import { CourseSelector, StatsCard, ContentPanel } from '.'
import type { CourseConfig } from './curriculumData'

const CurriculumMap = dynamic(
  () => import('./explorer/CurriculumMap').then((mod) => mod.CurriculumMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[420px] animate-pulse items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02]"
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">ম্যাপ লোড হচ্ছে…</span>
      </div>
    ),
  }
)

const courses = courseCurriculum.courses

interface CourseCurriculumContentProps {
  courseConfigs: readonly CourseConfig[]
}

type CurriculumView = 'list' | 'map'

export function CourseCurriculumContent({ courseConfigs }: CourseCurriculumContentProps) {
  const [active, setActive] = useState(0)
  const [view, setView] = useState<CurriculumView>('list')
  const isMobile = useIsMobile()
  const effectiveView = isMobile ? 'list' : view
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

      <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
        <div className="hidden items-center justify-end gap-3 md:flex">
          <span className="font-bangla text-[11px] font-semibold text-white/55">
            দেখার ধরন
          </span>
          <div
            role="group"
            aria-label="পাঠ্যক্রম দেখানোর ধরন"
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-black/30 p-1"
          >
            <ViewButton
              active={view === 'list'}
              onClick={() => setView('list')}
              icon={<List className="h-3.5 w-3.5" aria-hidden="true" />}
              label="তালিকা"
            />
            <ViewButton
              active={view === 'map'}
              onClick={() => setView('map')}
              icon={<GitBranch className="h-3.5 w-3.5" aria-hidden="true" />}
              label="ম্যাপ"
            />
          </div>
        </div>

        {effectiveView === 'map' ? (
          <CurriculumMap course={course} config={cfg} courseIndex={active} />
        ) : (
          <ContentPanel
            course={course}
            config={cfg}
            modules={modules}
            projects={projects}
            configs={courseConfigs}
            activeCourse={active}
          />
        )}
      </div>
    </div>
  )
}

function ViewButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3.5 font-bangla text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
      )}
    >
      {icon}
      {label}
    </button>
  )
}
