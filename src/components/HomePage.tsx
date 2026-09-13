import type { PortfolioProject } from '../types/portfolio';
import { ProjectList } from './ProjectList';

type HomePageProps = {
  projects: PortfolioProject[];
};

export function HomePage({ projects }: HomePageProps) {
  return (
    <>
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-indigo-700">Portfolio</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Selected projects
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          A selection of product-focused projects, with the technical decisions
          behind each one.
        </p>
      </header>

      {projects.length > 0 ? (
        <div className="mt-12">
          <ProjectList projects={projects} />
        </div>
      ) : (
        <p className="mt-12 text-slate-600">No projects are available yet.</p>
      )}
    </>
  );
}
