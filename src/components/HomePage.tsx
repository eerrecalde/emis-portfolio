import type { PortfolioProject } from '../types/portfolio';
import { ProjectList } from './ProjectList';

type HomePageProps = {
  projects: PortfolioProject[];
};

export function HomePage({ projects }: HomePageProps) {
  return (
    <>
      <header className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/55 px-6 py-12 shadow-2xl shadow-black/20 sm:px-10 sm:py-16">
        <div className="absolute -right-24 top-1/2 size-72 -translate-y-1/2 rounded-full border border-cyan-400/45 shadow-[0_0_80px_15px_rgba(99,102,241,0.25)]" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
            Portfolio
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
            Complex products.
            <span className="block bg-linear-to-r from-violet-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
              Thoughtful interfaces.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A selection of product-focused projects, with the technical
            decisions behind each one.
          </p>
        </div>
      </header>

      <section className="mt-16" aria-labelledby="selected-projects">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
              Selected work
            </p>
            <h2
              className="mt-3 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl"
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
            <ProjectList projects={projects} />
          </div>
        ) : (
          <p className="mt-8 text-slate-400">No projects are available yet.</p>
        )}
      </section>
    </>
  );
}
