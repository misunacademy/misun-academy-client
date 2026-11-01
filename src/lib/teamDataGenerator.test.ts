import { describe, it, expect } from 'vitest';
import { generateTeamData } from '@/lib/teamDataGenerator';

const member = (id: string) => ({
  _id: id,
  name: `Member ${id}`,
  position: 'Instructor',
  image: `/img/${id}.png`,
});

describe('generateTeamData', () => {
  it('returns an empty array for no members', () => {
    expect(generateTeamData([])).toEqual([]);
  });

  it('splits 8 members into one slide with two rows of 4', () => {
    const team = Array.from({ length: 8 }, (_, i) => member(String(i + 1)));
    const result = generateTeamData(team);
    expect(result).toHaveLength(1);
    expect(result[0].row1.map((m) => m._id)).toEqual(['1', '2', '3', '4']);
    expect(result[0].row2.map((m) => m._id)).toEqual(['5', '6', '7', '8']);
  });

  it('creates multiple slides for more than 8 members', () => {
    const team = Array.from({ length: 10 }, (_, i) => member(String(i + 1)));
    const result = generateTeamData(team);
    expect(result).toHaveLength(2);
    expect(result[0].row1).toHaveLength(4);
    expect(result[0].row2).toHaveLength(4);
    expect(result[1].row1.map((m) => m._id)).toEqual(['9', '10']);
    expect(result[1].row2).toEqual([]);
  });

  it('handles a partial first row', () => {
    const team = [member('a'), member('b'), member('c')];
    const result = generateTeamData(team);
    expect(result).toHaveLength(1);
    expect(result[0].row1).toHaveLength(3);
    expect(result[0].row2).toEqual([]);
  });

  it('preserves member fields untouched', () => {
    const team = [member('x')];
    const result = generateTeamData(team);
    expect(result[0].row1[0]).toEqual(team[0]);
  });
});
