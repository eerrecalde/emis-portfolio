import { ProjectList } from '../../components/ProjectList';
import type { PortfolioProject, PortfolioSkill } from '../../types/portfolio';

type HomePageProps = {
  projects: PortfolioProject[];
  skillsById: ReadonlyMap<string, PortfolioSkill>;
};

export function HomePage({ projects, skillsById }: HomePageProps) {
  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/55 px-6 py-12 shadow-2xl shadow-black/20 sm:px-10 sm:py-16">
        <div className="absolute -right-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-[#080d0f] shadow-[0_0_58px_12px_rgba(99,102,241,0.28),0_0_14px_2px_rgba(34,211,238,0.42)]" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
            Portfolio
          </p>
          <h1 className="mt-5 max-w-2xl text-3xl font-normal tracking-tight text-slate-100 sm:text-4xl lg:text-4xl">
            Frontend <span className="text-cyan-300">|</span> Product{' '}
            <span className="text-cyan-300">|</span>{' '}
            <span className="whitespace-nowrap">Full-stack</span> Engineer
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Frontend-focused engineer with 15+ years of experience building
            product interfaces, design systems, and full-stack features.
          </p>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="selected-projects">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
              Selected work
            </p>
            <h2
              className="mt-3 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl"
              id="selected-projects"
            >
              Selected projects
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Projects with real constraints
            </p>
          </div>
          <span className="hidden text-sm text-slate-400 sm:block">
            {projects.length} projects
          </span>
        </div>

        {projects.length > 0 ? (
          <div className="mt-8">
            <ProjectList projects={projects} skillsById={skillsById} />
          </div>
        ) : (
          <p className="mt-8 text-slate-400">No projects are available yet.</p>
        )}
      </section>
    </>
  );
}
