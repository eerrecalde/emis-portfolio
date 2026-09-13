import type { PortfolioSkill } from '../types/portfolio';
import { formatYears } from '../utils/formatYears';

type VisibleSkillsListProps = { skills: PortfolioSkill[] };

export function VisibleSkillsList({ skills }: VisibleSkillsListProps) {
  return (
    <section
      aria-labelledby="visible-skills-heading"
      aria-live="polite"
      className="sr-only"
    >
      <h2 id="visible-skills-heading">Visible skills</h2>
      <ul>
        {skills.map((skill) => (
          <li key={skill.id}>
            {skill.displayName}: {formatYears(skill.yearsOfExperience)}
          </li>
        ))}
      </ul>
    </section>
  );
}
