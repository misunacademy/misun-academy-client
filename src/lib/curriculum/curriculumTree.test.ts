import { describe, expect, it } from 'vitest';
import { buildCurriculumTree } from './buildCurriculumTree';
import { CURRICULUM_MAP, layoutCurriculumTree } from './layoutCurriculumTree';

const course = {
  title: 'Photoshop Hero',
  level: 'Basic to Advanced',
  modules: [
    { id: 1, title: 'Design Theory', type: 'theory', duration: '2 hours' },
    { id: 2, title: 'Selection', type: 'practical', duration: '3 hours' },
  ],
  projects: [{ title: 'Poster Design', duration: '4 hours' }],
};

describe('buildCurriculumTree', () => {
  it('groups modules and projects under the course', () => {
    const tree = buildCurriculumTree(course, 1);

    expect(tree.kind).toBe('course');
    expect(tree.label).toBe('Photoshop Hero');
    expect(tree.children).toHaveLength(2);
    expect(tree.children?.[0]).toMatchObject({ label: 'মডিউল', kind: 'group' });
    expect(tree.children?.[0].children).toHaveLength(2);
    expect(tree.children?.[1]).toMatchObject({ label: 'প্রজেক্ট', kind: 'group' });
    expect(tree.children?.[1].children).toHaveLength(1);
  });

  it('creates stable unique ids for every node', () => {
    const tree = buildCurriculumTree(course, 2);
    const ids = [tree.id, ...(tree.children ?? []).flatMap((group) => [
      group.id,
      ...(group.children ?? []).map((item) => item.id),
    ])];

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe('course-2');
  });

  it('omits a group when it has no items', () => {
    const tree = buildCurriculumTree({ ...course, projects: [] }, 0);

    expect(tree.children).toHaveLength(1);
    expect(tree.children?.[0].kind).toBe('group');
    expect(tree.children?.[0].label).toBe('মডিউল');
  });
});

describe('layoutCurriculumTree', () => {
  it('places the course above two side-by-side clusters', () => {
    const tree = buildCurriculumTree(course);
    const layout = layoutCurriculumTree(tree);

    expect(layout.groups).toHaveLength(2);
    expect(layout.links).toHaveLength(2);
    expect(layout.root.itemCount).toBe(3);
    expect(layout.groups[0].items).toHaveLength(2);
    expect(layout.groups[1].items).toHaveLength(1);
    expect(layout.root.y + layout.root.height).toBeLessThan(layout.groups[0].y);
    expect(layout.groups[0].x + layout.groups[0].width).toBeLessThan(
      layout.groups[1].x
    );
  });

  it('sizes each cluster from its item count', () => {
    const tree = buildCurriculumTree(course);
    const layout = layoutCurriculumTree(tree);
    const expectedModuleHeight =
      CURRICULUM_MAP.groupPadding * 2 +
      CURRICULUM_MAP.groupHeaderHeight +
      CURRICULUM_MAP.groupHeaderGap +
      2 * CURRICULUM_MAP.itemHeight +
      CURRICULUM_MAP.itemGap;

    expect(layout.groups[0].height).toBe(expectedModuleHeight);
    expect(layout.groups[0].height).toBeGreaterThan(layout.groups[1].height);
    expect(layout.height).toBe(
      CURRICULUM_MAP.padding * 2 +
        CURRICULUM_MAP.rootHeight +
        CURRICULUM_MAP.rootGap +
        layout.groups[0].height
    );
  });

  it('centers the course and fans links to each cluster', () => {
    const tree = buildCurriculumTree(course);
    const layout = layoutCurriculumTree(tree);
    const rootCenter = layout.root.x + layout.root.width / 2;

    expect(rootCenter).toBe(layout.width / 2);
    expect(layout.links[0]).toMatchObject({
      x1: rootCenter,
      y1: layout.root.y + layout.root.height,
      x2: layout.groups[0].x + layout.groups[0].width / 2,
      y2: layout.groups[0].y,
    });
    expect(layout.links[1].x2).toBeGreaterThan(layout.links[0].x2);
  });
});
