import type { SkillArea } from '../types/portfolio';

const AREA_LABELS: Record<SkillArea, string> = {
  react: 'React',
  angular: 'Angular',
  frontend: 'Frontend',
  backend: 'Backend',
  analytics: 'Analytics',
  testing: 'Testing',
  devops: 'DevOps',
  'ci-cd': 'CI/CD',
};

type SkillFilterProps = {
  activeArea: SkillArea | undefined;
  availableAreas: SkillArea[];
  shownCount: number;
  totalCount: number;
  onToggle: (area: SkillArea) => void;
};

export function SkillFilter({
  activeArea,
  availableAreas,
  shownCount,
  totalCount,
  onToggle,
}: SkillFilterProps) {
  return (
    <section className="mt-8" aria-label="Filter skills by area">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-400" aria-live="polite">
          {shownCount} of {totalCount} skills shown
        </p>
        <div className="flex flex-wrap gap-2">
          {availableAreas.map((area) => {
            const isActive = activeArea === area;
            return (
              <button
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 motion-reduce:transition-none ${
                  isActive
                    ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-100'
                    : 'border-slate-700 bg-slate-950/40 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                }`}
                key={area}
                onClick={() => onToggle(area)}
                type="button"
              >
                {AREA_LABELS[area]}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
