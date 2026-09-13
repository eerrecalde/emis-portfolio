import { Link } from 'react-router';
import { resolveSkills } from '../data/skills';
import type { PortfolioProject, PortfolioSkill } from '../types/portfolio';

type ProjectListProps = {
  projects: PortfolioProject[];
  skillsById: ReadonlyMap<string, PortfolioSkill>;
  headingLevel?: 'h2' | 'h3';
};

export function ProjectList({
  projects,
  skillsById,
  headingLevel = 'h2',
}: ProjectListProps) {
  const Heading = headingLevel;

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li
          className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-950/65 transition duration-200 hover:-translate-y-1 hover:border-slate-600 hover:shadow-xl hover:shadow-indigo-950/30 focus-within:border-cyan-400/70"
          key={project.slug}
        >
          <Link
            aria-label={`View project: ${project.title}`}
            className="block h-full focus-visible:rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
            to={`/projects/${project.slug}`}
          >
            {project.screenshots[0] ? (
              <img
                alt={project.screenshots[0].alt}
                className="aspect-[16/10] w-full border-b border-slate-800 object-cover transition duration-300 group-hover:scale-[1.02]"
                decoding="async"
                loading="lazy"
                sizes="(min-width: 1024px) 352px, (min-width: 640px) 45vw, 100vw"
                src={project.screenshots[0].url}
              />
            ) : null}
            <div className="p-5">
              <Heading className="text-xl font-semibold tracking-tight text-slate-100">
                {project.title}
              </Heading>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {project.summary}
              </p>
              <p className="mt-5 text-xs font-medium tracking-wide text-slate-400">
                {resolveSkills(project.skillIds, skillsById)
                  .map((skill) => skill.displayName)
                  .slice(0, 2)
                  .join(' · ')}
              </p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition group-hover:text-cyan-100">
                View project <span aria-hidden="true">→</span>
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
