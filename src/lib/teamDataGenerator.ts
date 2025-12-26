import { StaticImageData } from 'next/image';

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  image: string | StaticImageData;
}

interface TeamRows {
  row1: TeamMember[];
  row2: TeamMember[];
}

export function generateTeamData(teamInfo: TeamMember[]): TeamRows[] {
  const result: TeamRows[] = [];
  for (let i = 0; i < teamInfo.length; i += 8) {
    const row1 = teamInfo.slice(i, i + 4);
    const row2 = teamInfo.slice(i + 4, i + 8);
    result.push({ row1, row2 });
  }
  return result;
}
