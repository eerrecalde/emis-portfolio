import type { PortfolioSkill } from '../types/portfolio';

export function resolveSkills(
  skillIds: string[],
  skillsById: ReadonlyMap<string, PortfolioSkill>,
): PortfolioSkill[] {
  return skillIds.flatMap((skillId) => {
    const skill = skillsById.get(skillId);

    return skill ? [skill] : [];
  });
}
