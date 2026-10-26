'use client';

import { useMemo } from 'react';
import type { Course, CourseConfig } from '../curriculumData';
import { TYPE_STYLES } from '../curriculumData';
import { buildCurriculumTree, type CurriculumTreeData } from '@/lib/curriculum/buildCurriculumTree';
import {
  layoutCurriculumTree,
  type CurriculumMapGroup,
} from '@/lib/curriculum/layoutCurriculumTree';

interface CurriculumMapProps {
  course: Course;
  config: CourseConfig;
  courseIndex: number;
}

export function CurriculumMap({ course, config, courseIndex }: CurriculumMapProps) {
  const data = useMemo(
    () => buildCurriculumTree(course, courseIndex),
    [course, courseIndex]
  );
  const layout = useMemo(() => layoutCurriculumTree(data), [data]);

  return (
    <section
      aria-label={`${course.title} পাঠ্যক্রম ম্যাপ`}
      className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-[#07100c] via-surface to-[#050b08]"
      style={{ borderColor: config.border }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${config.color}88, transparent)` }}
      />
      <p className="border-b border-white/[0.06] px-4 py-2.5 font-bangla text-[11px] text-white/70">
        কোর্স, মডিউল ও প্রজেক্ট শাখা এক নজরে দেখুন।
      </p>
      <div
        className="overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary/60"
        role="region"
        aria-label={`${course.title} ম্যাপ`}
        tabIndex={0}
      >
        <div
          aria-hidden="true"
          className="relative mx-auto"
          style={{ width: layout.width, height: layout.height }}
        >
          <svg
            width={layout.width}
            height={layout.height}
            className="absolute inset-0"
            focusable="false"
          >
            {layout.links.map((link, index) => (
              <path
                key={layout.groups[index]?.data.id ?? index}
                d={`M ${link.x1} ${link.y1} C ${link.x1} ${link.y1 + 24}, ${link.x2} ${
                  link.y2 - 24
                }, ${link.x2} ${link.y2}`}
                fill="none"
                stroke={config.color}
                strokeOpacity="0.4"
                strokeWidth="1.5"
              />
            ))}
          </svg>

          <RootNode root={layout.root} config={config} />
          {layout.groups.map((group) => (
            <GroupPanel key={group.data.id} group={group} config={config} />
          ))}
        </div>
      </div>

      <ScreenReaderTree data={data} />
    </section>
  );
}

function RootNode({
  root,
  config,
}: {
  root: ReturnType<typeof layoutCurriculumTree>['root'];
  config: CourseConfig;
}) {
  return (
    <div
      className="absolute"
      style={{
        left: root.x,
        top: root.y,
        width: root.width,
        height: root.height,
      }}
    >
      <div
        className="flex h-full flex-col rounded-2xl border p-3.5"
        style={{
          background: `linear-gradient(135deg, ${config.bg}, ${config.bgMid})`,
          borderColor: config.borderHover,
          boxShadow: `0 0 24px ${config.glow}`,
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: config.color }}
          >
            Course
          </span>
          <span className="shrink-0 font-bangla text-[10px] text-white/55">
            {root.itemCount}টি ক্লাস
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-white">
          {root.data.label}
        </p>
        <p className="mt-auto truncate text-[10px] text-white/55" title={root.data.meta}>
          {root.data.meta}
        </p>
      </div>
    </div>
  );
}

function GroupPanel({ group, config }: { group: CurriculumMapGroup; config: CourseConfig }) {
  return (
    <div
      className="absolute"
      style={{
        left: group.x,
        top: group.y,
        width: group.width,
        height: group.height,
      }}
    >
      <div
        className="flex h-full flex-col overflow-hidden rounded-xl border bg-black/40 p-3"
        style={{ borderColor: `${config.color}45` }}
      >
        <div className="mb-2 flex h-[30px] items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: config.color }}
              aria-hidden="true"
            />
            <span className="font-bangla text-xs font-bold text-white">{group.data.label}</span>
          </div>
          <span className="font-bangla text-[10px] text-white/55">{group.data.meta}</span>
        </div>

        <ul className="flex flex-1 flex-col gap-[3px]">
          {group.items.map((item) => {
            const typeStyle = item.type ? TYPE_STYLES[item.type] : undefined;
            return (
              <li
                key={item.id}
                className="flex h-[28px] items-center gap-2 rounded-lg bg-white/[0.035] px-2"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: typeStyle?.color ?? config.color }}
                  aria-hidden="true"
                />
                <span
                  className="min-w-0 flex-1 truncate text-[11px] text-white/85"
                  title={item.label}
                >
                  {item.label}
                </span>
                {item.meta && (
                  <span className="shrink-0 text-[9px] text-white/50">{item.meta}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function ScreenReaderTree({ data }: { data: CurriculumTreeData }) {
  return (
    <ul className="sr-only">
      <li>
        {data.label}
        {data.meta ? ` — ${data.meta}` : ''}
        {data.children && data.children.length > 0 && (
          <ul>
            {data.children.map((child) => (
              <li key={child.id}>
                {child.label}
                {child.meta ? ` — ${child.meta}` : ''}
                {child.children && child.children.length > 0 && (
                  <ul>
                    {child.children.map((item) => (
                      <li key={item.id}>
                        {item.label}
                        {item.meta ? ` — ${item.meta}` : ''}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    </ul>
  );
}
