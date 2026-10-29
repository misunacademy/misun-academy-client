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
          label: 'Tool-Based Modules',
          items: [
            { id: 'ps-m1', title: 'Fundamental Concept of Design Theory', type: 'theory', hours: 2 },
            { id: 'ps-m2', title: 'Mastering Image Selection | Background Remove | Image Placement', type: 'practical', hours: 3 },
            { id: 'ps-m3', title: 'Advance Image Enhancement', type: 'practical', hours: 2.5 },
            { id: 'ps-m4', title: 'Brush and Clone Special Class', type: 'practical', hours: 2 },
            { id: 'ps-m5', title: 'Advance Gradient and Perfect Background Selection', type: 'practical', hours: 2.5 },
            { id: 'ps-m6', title: 'Pen Tool Special Class', type: 'practical', hours: 3 },
            { id: 'ps-m7', title: 'Typography Special Class', type: 'practical', hours: 2 },
            { id: 'ps-m8', title: 'Basic to Advance Animation in Photoshop (Cartoon, Google Ad)', type: 'practical', hours: 4 },
          ],
        },
        {
          id: 'projects',
          kind: 'project',
          label: 'Project-Based Classes',
          items: [
            { id: 'ps-p1', title: 'Advance Skin Retouching for Natok, YouTube and Social Media Poster', hours: 3 },
            { id: 'ps-p2', title: 'Social Media Design Masterclass', hours: 4 },
            { id: 'ps-p3', title: 'YouTube Thumbnail Design Masterclass', hours: 3 },
            { id: 'ps-p4', title: 'Facebook Cover Design Special Class', hours: 2 },
            { id: 'ps-p5', title: 'Natok Thumbnail Design Special Class', hours: 3 },
            { id: 'ps-p6', title: 'Advance Image Manipulation Masterclass', hours: 4 },
            { id: 'ps-p7', title: 'Advance Image Editing with Advanced Glowing Effect', hours: 3 },
            { id: 'ps-p8', title: 'Product Manipulation Special Class', hours: 3 },
            { id: 'ps-p9', title: 'Use AI in Your Design (AI Implementation Masterclass)', hours: 2 },
            { id: 'ps-p10', title: 'Advance Idea Generation for Design (Special Resources)', hours: 2 },
            { id: 'ps-p11', title: 'Instagram Advance Carousel Design', hours: 3 },
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
          label: 'Tool-Based Modules',
          items: [
            { id: 'ai-m1', title: 'Basic to Advance Interfacing | Create Your Own Interface', type: 'theory', hours: 2 },
            { id: 'ai-m2', title: 'Mastering Pen Tool and Typography', type: 'practical', hours: 3 },
            { id: 'ai-m3', title: 'Custom Shape Creation | Advance Shape Making', type: 'practical', hours: 2.5 },
            { id: 'ai-m4', title: 'Mandala Design Special Class', type: 'practical', hours: 3 },
            { id: 'ai-m5', title: 'Paint & Blob Brush Advanced Techniques', type: 'practical', hours: 2 },
            { id: 'ai-m6', title: 'Rotation and Reflection in Design', type: 'practical', hours: 2 },
            { id: 'ai-m7', title: 'Pathfinder and Shape Builder Special Class', type: 'practical', hours: 2.5 },
            { id: 'ai-m8', title: 'Gradient and Blend Tool Masterclass', type: 'practical', hours: 3 },
            { id: 'ai-m9', title: 'Advance Techniques for Infographic Design', type: 'practical', hours: 3 },
          ],
        },
        {
          id: 'projects',
          kind: 'project',
          label: 'Project-Based Classes',
          items: [
            { id: 'ai-p1', title: 'Business Card Design', hours: 2 },
            { id: 'ai-p2', title: 'Logo Design Masterclass', hours: 4 },
            { id: 'ai-p3', title: 'Vector & Image Tracing and Banner Design', hours: 3 },
            { id: 'ai-p4', title: 'T-Shirt Design', hours: 3 },
            { id: 'ai-p5', title: 'Book Cover Design', hours: 2.5 },
            { id: 'ai-p6', title: 'Flyer Design', hours: 2 },
            { id: 'ai-p7', title: 'Personal Portfolio Building', hours: 3 },
            { id: 'ai-p8', title: 'Advanced Techniques to Grow Portfolio', hours: 2 },
            { id: 'ai-p9', title: 'Client Reach Design Ideas', hours: 2 },
          ],
        },
      ],
    },
    {
      id: 'guardian-client-hunting',
      title: 'Guardian in Client Hunting',
      description: 'Master the art of finding and securing clients',
      // NOTE: this level label (and the two section labels below) are new wording
      // added for the redesign. Please confirm or replace them.
      level: 'Strategy Based',
      sections: [
        {
          id: 'find-clients',
          kind: 'module',
          label: 'Find Clients',
          items: [
            { id: 'ch-1', title: 'Local Client Hunting', type: 'strategy', hours: 2 },
            { id: 'ch-2', title: 'International Client Hunting', type: 'strategy', hours: 3 },
            { id: 'ch-3', title: 'Facebook Client Tricks', type: 'strategy', hours: 1.5 },
            { id: 'ch-4', title: 'LinkedIn Client Tricks', type: 'strategy', hours: 1.5 },
            { id: 'ch-5', title: 'Email & Number Marketing', type: 'strategy', hours: 2 },
            { id: 'ch-6', title: 'Fiverr Marketplace Masterclass', type: 'strategy', hours: 3 },
          ],
        },
        {
          id: 'get-hired',
          kind: 'module',
          label: 'Get Hired & Earn',
          items: [
            { id: 'ch-7', title: 'Marketing Tips and Tricks', hours: 2.5 },
            { id: 'ch-8', title: 'How to Find a Remote Job', hours: 2 },
            { id: 'ch-9', title: 'CV/Resume Building & Job Apply', hours: 2 },
            { id: 'ch-10', title: 'Passive Income with Design', hours: 2.5 },
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