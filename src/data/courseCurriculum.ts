export type ItemType = 'theory' | 'practical' | 'strategy'

export interface CurriculumItem {
  id: string
  title: string
  hours: number
  /** Only needed where the item type is shown (left-hand section). */
  type?: ItemType
}

export type SectionKind = 'module' | 'project'

export interface CurriculumSection {
  id: string
  /**
   * How this section is counted in totals such as "28+ modules, 20+ projects".
   * This is separate from where the section is drawn (left or right). For
   * example, Guardian's right-hand section is drawn as a branch group but its
   * classes are still modules, not projects.
   */
  kind: SectionKind
  label: string
  items: CurriculumItem[]
}

export interface Course {
  id: string
  title: string
  description: string
  level: string
  /**
   * Always exactly two sections: [0] is drawn on the left of the hub,
   * [1] on the right (the branches). Every course therefore has the same
   * shape, with no special cases for courses that lack projects.
   */
  sections: readonly [CurriculumSection, CurriculumSection]
}

export const courseCurriculum: { courses: Course[] } = {
courses: [
    {
      id: 'photoshop-hero',
      title: 'Photoshop Hero',
      description: 'Master image editing, manipulation, and digital design',
      level: 'Tool Based - Basic to Advanced',
      sections: [
        {
          id: 'modules',
          kind: 'module',
          label: 'Core Skill Lab',
          items: [
            { id: 'ps-m1', title: 'Design Psychology & Visual Theory', type: 'theory', hours: 2 },
            { id: 'ps-m2', title: 'Precision Selection, Background Removal & Compositing', type: 'practical', hours: 3 },
            { id: 'ps-m3', title: 'Pro Image Enhancement & Color Grading', type: 'practical', hours: 2.5 },
            { id: 'ps-m4', title: 'Pro Retouch: Brush & Clone Deep Dive', type: 'practical', hours: 2 },
            { id: 'ps-m5', title: 'Gradient Mastery & Cinematic Backgrounds', type: 'practical', hours: 2.5 },
            { id: 'ps-m6', title: 'Precision Pen Tool Mastery', type: 'practical', hours: 3 },
            { id: 'ps-m7', title: 'Typography That Sells', type: 'practical', hours: 2 },
            { id: 'ps-m8', title: 'Motion in Photoshop: Animated Ads & Cartoon GIFs', type: 'practical', hours: 4 },
          ],
        },
        {
          id: 'projects',
          kind: 'project',
          label: 'Real Client Projects',
          items: [
            { id: 'ps-p1', title: 'High-End Skin Retouching for Natok, YouTube & Posters', hours: 3 },
            { id: 'ps-p2', title: 'Social Media Design Masterclass: Scroll-Stopping Creatives', hours: 4 },
            { id: 'ps-p3', title: 'YouTube Thumbnail Masterclass: High-CTR Design', hours: 3 },
            { id: 'ps-p4', title: 'Facebook Cover & Brand Page Design', hours: 2 },
            { id: 'ps-p5', title: 'Natok & OTT Thumbnail Design Masterclass', hours: 3 },
            { id: 'ps-p6', title: 'Advanced Photo Manipulation Masterclass', hours: 4 },
            { id: 'ps-p7', title: 'Cinematic Glow & Light Effects Editing', hours: 3 },
            { id: 'ps-p8', title: 'Product Manipulation for E-commerce Ads', hours: 3 },
            { id: 'ps-p9', title: 'Creative Idea Generation System + Resource Vault', hours: 2 },
            { id: 'ps-p10', title: 'Instagram Carousel Design Masterclass', hours: 3 },
          ],
        },
      ],
    },
    {
      id: 'illustrator-wizard',
      title: 'Illustrator Wizard',
      description: 'Become a wizard in printing design and vector graphic',
      level: 'Tool Based - Basic to Advanced',
      sections: [
        {
          id: 'modules',
          kind: 'module',
          label: 'Core Skill Lab',
          items: [
            { id: 'ai-m1', title: 'Pro Workspace Setup & Custom Interface', type: 'theory', hours: 2 },
            { id: 'ai-m2', title: 'Pen Tool & Typography Precision', type: 'practical', hours: 3 },
            { id: 'ai-m3', title: 'Custom Shape Engineering', type: 'practical', hours: 2.5 },
            { id: 'ai-m4', title: 'Mandala & Pattern Design Masterclass', type: 'practical', hours: 3 },
            { id: 'ai-m5', title: 'Paint & Blob Brush Pro Techniques', type: 'practical', hours: 2 },
            { id: 'ai-m6', title: 'Rotation, Reflection & Symmetry Design', type: 'practical', hours: 2 },
            { id: 'ai-m7', title: 'Pathfinder & Shape Builder Deep Dive', type: 'practical', hours: 2.5 },
            { id: 'ai-m8', title: 'Gradient & Blend Masterclass', type: 'practical', hours: 3 },
            { id: 'ai-m9', title: 'Infographic Design Masterclass', type: 'practical', hours: 3 },
            { id: 'ai-m10', title: 'NEW Illustrator AI Workflow: Text to Vector, Generative Recolor & Mockups', type: 'practical', hours: 2.5 },
          ],
        },
        {
          id: 'projects',
          kind: 'project',
          label: 'Real Client Projects',
          items: [
            { id: 'ai-p1', title: 'Premium Business Card & Stationery Suite', hours: 2 },
            { id: 'ai-p2', title: 'Logo Design Masterclass: From Concept to Brand Mark', hours: 4 },
            { id: 'ai-p3', title: 'Image Tracing & Banner Design', hours: 3 },
            { id: 'ai-p4', title: 'T-Shirt Design Masterclass', hours: 3 },
            { id: 'ai-p5', title: 'Book Cover Design', hours: 2.5 },
            { id: 'ai-p6', title: 'Flyer & Print Ad Design', hours: 2 },
            { id: 'ai-p7', title: 'Portfolio Studio: Build Your Behance-Ready Portfolio', hours: 3 },
            { id: 'ai-p8', title: 'Portfolio Growth Strategies', hours: 2 },
            { id: 'ai-p9', title: 'Client-Winning Design Concepts', hours: 2 },
          ],
        },
      ],
    },
    {
      id: 'guardian-client-hunting',
      title: 'Guardian in Client Hunting',
      description: 'Master the art of finding and securing clients',
      level: 'Strategy Based',
      sections: [
        {
          id: 'find-clients',
          kind: 'module',
          label: 'Client Acquisition System',
          items: [
            { id: 'ch-1', title: 'Local Client Hunting Strategy', type: 'strategy', hours: 2 },
            { id: 'ch-2', title: 'International Client Hunting Strategy', type: 'strategy', hours: 3 },
            { id: 'ch-3', title: 'Facebook Client Acquisition Playbook', type: 'strategy', hours: 1.5 },
            { id: 'ch-4', title: 'LinkedIn Personal Branding & Client Playbook', type: 'strategy', hours: 1.5 },
            { id: 'ch-5', title: 'Cold Email & Outreach System with AI', type: 'strategy', hours: 2 },
            { id: 'ch-6', title: 'Fiverr Marketplace Masterclass', type: 'strategy', hours: 3 },
          ],
        },
        {
          id: 'get-hired',
          kind: 'module',
          label: 'Income Engine',
          items: [
            { id: 'ch-7', title: 'Personal Brand Marketing', type: 'strategy', hours: 2.5 },
            { id: 'ch-8', title: 'Remote Job Hunting Strategy', type: 'strategy', hours: 2 },
            { id: 'ch-9', title: 'ATS-Ready CV & Portfolio Case Studies with AI', type: 'strategy', hours: 2 },
            { id: 'ch-10', title: 'Passive Income with Design: Templates, Print-on-Demand & Stock', type: 'strategy', hours: 2.5 },
            { id: 'ch-11', title: 'Client Communication & Retention', type: 'strategy', hours: 2 },
          ],
        },
      ],
    },
  ],
}

/* ── Derived stats: computed from the data, never hand-typed ───────────── */

export function getCourseStats(course: Course) {
  const items = course.sections.flatMap((s) => s.items)
  const totalHours = items.reduce((sum, item) => sum + item.hours, 0)
  return {
    totalItems: items.length,
    totalHours,
    sectionCounts: course.sections.map((s) => s.items.length),
  }
}

/** Totals across all courses, for the stats strip. Counted by section `kind`. */
export function getCurriculumTotals(courses: Course[] = courseCurriculum.courses) {
  let modules = 0
  let projects = 0
  let hours = 0
  for (const course of courses) {
    for (const section of course.sections) {
      if (section.kind === 'module') modules += section.items.length
      else projects += section.items.length
      hours += section.items.reduce((sum, item) => sum + item.hours, 0)
    }
  }
  return { modules, projects, hours }
}

/** 2 -> "2h", 2.5 -> "2.5h" */
export function formatHours(hours: number) {
  return `${hours}h`
}

/** Course ids are URL slugs, so they can back a ?course=... deep link. */
export function findCourseIndexById(id: string | null | undefined) {
  const index = courseCurriculum.courses.findIndex((c) => c.id === id)
  return index === -1 ? 0 : index // unknown or missing id falls back to the first course
}

/**
 * schema.org Course markup for search engines, generated from the same data
 * so it can never drift from what the page shows. Render it inside a
 * <script type="application/ld+json"> tag (server component preferred).
 * The provider name and url are passed in because they are not part of this data.
 */
export function getCourseJsonLd(course: Course, provider: { name: string; url: string }) {
  const { totalHours } = getCourseStats(course)
  const wholeHours = Math.floor(totalHours)
  const minutes = Math.round((totalHours - wholeHours) * 60)
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    // ISO 8601 duration, e.g. 48.5 hours -> "PT48H30M"
    timeRequired: `PT${wholeHours}H${minutes > 0 ? `${minutes}M` : ''}`,
    provider: { '@type': 'Organization', name: provider.name, url: provider.url },
  }
}