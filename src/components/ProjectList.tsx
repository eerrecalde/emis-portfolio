import { Link } from 'react-router';
import type { PortfolioProject } from '../types/portfolio';

type ProjectListProps = { projects: PortfolioProject[] };

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          key={project.slug}
        >
          <h2 className="text-lg font-semibold text-slate-950">
            <Link
              className="focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700"
              to={`/projects/${project.slug}`}
            >
              {project.title}
            </Link>
          </h2>
          <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
            {project.summary}
          </p>
          <p className="mt-4 text-sm text-slate-500">
            {project.techStack.slice(0, 2).join(' · ')}
          </p>
          <Link
            className="mt-4 inline-flex text-sm font-medium text-indigo-700 hover:text-indigo-900 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700"
            to={`/projects/${project.slug}`}
          >
            View project<span className="sr-only">: {project.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
