import type { ProfessionalExperience } from '../../types/portfolio';
import { ExperienceTimeline } from './ExperienceTimeline';

type ExperiencePageProps = { experience: ProfessionalExperience[] };

export function ExperiencePage({ experience }: ExperiencePageProps) {
  return (
    <>
      <header className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
          Experience
        </p>
        <h1 className="mt-4 text-3xl font-normal tracking-tight text-slate-100 sm:text-4xl">
          Professional experience
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          Frontend engineering experience across product teams, platforms, and
          customer-facing web applications.
        </p>
      </header>
      <ExperienceTimeline experience={experience} />
    </>
  );
}
