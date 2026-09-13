import type { ProjectProfile } from '../types/projects';

type ProjectListProps = { projects: ProjectProfile[] };

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          key={project.slug}
        >
          <h2 className="text-lg font-semibold text-slate-950">
            {project.repository.name}
          </h2>
          <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
            {project.repository.description ??
              'Project details are being prepared.'}
          </p>
          <p className="mt-4 text-sm text-slate-500">
            {project.languages
              .slice(0, 2)
              .map((language) => language.name)
              .join(' · ')}
          </p>
          <a
            className="mt-4 inline-flex text-sm font-medium text-indigo-700 hover:text-indigo-900"
            href={project.repository.url}
          >
            View repository
          </a>
        </li>
      ))}
    </ul>
  );
}
