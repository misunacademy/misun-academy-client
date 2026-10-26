import { hierarchy } from 'd3-hierarchy';
import type { CurriculumTreeData } from './buildCurriculumTree';

export const CURRICULUM_MAP = {
  padding: 20,
  rootWidth: 220,
  rootHeight: 104,
  groupWidth: 320,
  groupHeaderHeight: 30,
  groupHeaderGap: 8,
  groupPadding: 12,
  itemHeight: 28,
  itemGap: 3,
  rootGap: 36,
  groupGap: 24,
} as const;

export interface CurriculumMapRoot {
  data: CurriculumTreeData;
  x: number;
  y: number;
  width: number;
  height: number;
  itemCount: number;
}

export interface CurriculumMapGroup {
  data: CurriculumTreeData;
  items: CurriculumTreeData[];
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CurriculumMapLink {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface CurriculumMapLayout {
  root: CurriculumMapRoot;
  groups: CurriculumMapGroup[];
  links: CurriculumMapLink[];
  width: number;
  height: number;
}

export function layoutCurriculumTree(data: CurriculumTreeData): CurriculumMapLayout {
  const root = hierarchy<CurriculumTreeData>(data);
  const groupNodes = root.children ?? [];

  const groups: CurriculumMapGroup[] = groupNodes.map((group, index) => {
    const items = group.children ?? [];
    const height =
      CURRICULUM_MAP.groupPadding * 2 +
      CURRICULUM_MAP.groupHeaderHeight +
      CURRICULUM_MAP.groupHeaderGap +
      items.length * CURRICULUM_MAP.itemHeight +
      Math.max(0, items.length - 1) * CURRICULUM_MAP.itemGap;

    return {
      data: group.data,
      items: items.map((item) => item.data),
      x:
        CURRICULUM_MAP.padding +
        index * (CURRICULUM_MAP.groupWidth + CURRICULUM_MAP.groupGap),
      y: CURRICULUM_MAP.padding + CURRICULUM_MAP.rootHeight + CURRICULUM_MAP.rootGap,
      width: CURRICULUM_MAP.groupWidth,
      height,
    };
  });

  const groupsWidth =
    groups.length > 0
      ? groups.length * CURRICULUM_MAP.groupWidth +
        (groups.length - 1) * CURRICULUM_MAP.groupGap
      : CURRICULUM_MAP.rootWidth;

  const width = CURRICULUM_MAP.padding * 2 + Math.max(groupsWidth, CURRICULUM_MAP.rootWidth);
  const groupsHeight = groups.reduce((max, group) => Math.max(max, group.height), 0);
  const height =
    CURRICULUM_MAP.padding * 2 +
    CURRICULUM_MAP.rootHeight +
    CURRICULUM_MAP.rootGap +
    groupsHeight;

  const itemCount = groups.reduce((total, group) => total + group.items.length, 0);

  const rootLayout: CurriculumMapRoot = {
    data,
    x: (width - CURRICULUM_MAP.rootWidth) / 2,
    y: CURRICULUM_MAP.padding,
    width: CURRICULUM_MAP.rootWidth,
    height: CURRICULUM_MAP.rootHeight,
    itemCount,
  };

  const links: CurriculumMapLink[] = groups.map((group) => ({
    x1: rootLayout.x + rootLayout.width / 2,
    y1: rootLayout.y + rootLayout.height,
    x2: group.x + group.width / 2,
    y2: group.y,
  }));

  return { root: rootLayout, groups, links, width, height };
}
