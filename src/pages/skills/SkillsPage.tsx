import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { SkillFilter } from '../../components/SkillFilter';
import { SkillsChart } from '../../components/SkillsChart';
import { VisibleSkillsList } from '../../components/VisibleSkillsList';
import {
  skillAreas,
  type PortfolioSkill,
  type SkillArea,
} from '../../types/portfolio';

type SkillsPageProps = { skills: PortfolioSkill[] };

export function SkillsPage({ skills }: SkillsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeArea = skillAreas.find(
    (area) => area === searchParams.get('filter'),
  );

  const availableAreas = useMemo(
    () =>
      skillAreas.filter((area) =>
        skills.some((skill) => skill.areas.includes(area)),
      ),
    [skills],
  );
  const sortedSkills = useMemo(
    () =>
      [...skills]
        .filter((skill) => !skill.hideFromSkills)
        .sort(
          (first, second) =>
            second.yearsOfExperience - first.yearsOfExperience ||
            first.displayName.localeCompare(second.displayName),
        ),
    [skills],
  );
  const visibleSkills = useMemo(
    () =>
      activeArea === undefined
        ? sortedSkills
        : sortedSkills.filter((skill) => skill.areas.includes(activeArea)),
    [activeArea, sortedSkills],
  );
  function toggleArea(area: SkillArea) {
    const nextParams = new URLSearchParams(searchParams);

    if (activeArea === area) {
      nextParams.delete('filter');
    } else {
      nextParams.set('filter', area);
    }

    setSearchParams(nextParams);
  }

  return (
    <>
      <header>
        <h1 className="text-3xl font-normal tracking-tight text-slate-100 sm:text-4xl">
          Skills
        </h1>
      </header>

      <SkillFilter
        activeArea={activeArea}
        availableAreas={availableAreas}
        shownCount={visibleSkills.length}
        totalCount={sortedSkills.length}
        onToggle={toggleArea}
      />
      <SkillsChart skills={sortedSkills} visibleSkills={visibleSkills} />
      <VisibleSkillsList skills={visibleSkills} />
    </>
  );
}
