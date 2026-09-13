import type { PortfolioSkillPreview } from '../types/portfolio';

export function resolveSkills(
  skillIds: string[],
  skillsById: ReadonlyMap<string, PortfolioSkillPreview>,
): PortfolioSkillPreview[] {
  return skillIds.flatMap((skillId) => {
    const skill = skillsById.get(skillId);

    return skill ? [skill] : [];
  });
}
