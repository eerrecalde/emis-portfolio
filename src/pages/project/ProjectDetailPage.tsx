import { Link } from 'react-router';
import { DetailList } from '../../components/DetailList';
import { resolveSkills } from '../../data/skills';
import type { PortfolioProject, PortfolioSkill } from '../../types/portfolio';

type ProjectDetailPageProps = {
  project: PortfolioProject;
  skillsById: ReadonlyMap<string, PortfolioSkill>;
};

export function ProjectDetailPage({
  project,
  skillsById,
}: ProjectDetailPageProps) {
  return (
    <article className="max-w-4xl">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-100 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
        to="/"
      >
        <span aria-hidden="true">←</span> Back to selected work
      </Link>
      <header className="mt-8 border-b border-slate-800 pb-12">
        <p className="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
          Case study
        </p>
        <h1 className="mt-4 text-3xl font-normal tracking-tight text-slate-100 sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          {project.summary}
        </p>
        {project.repositoryUrl ? (
          <a
            className="mt-7 inline-flex rounded-md bg-linear-to-r from-violet-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
            href={project.repositoryUrl}
          >
            View repository
          </a>
        ) : null}
      </header>

      <section className="mt-10" aria-labelledby="why-built">
        <h2 className="text-xl font-semibold text-slate-100" id="why-built">
          Why I built it
        </h2>
        <p className="mt-3 leading-7 text-slate-300">{project.whyBuilt}</p>
      </section>

      <DetailList
        heading="What it does"
        id="what-it-does"
        items={project.capabilities}
      />
      <DetailList
        heading="Technical highlights"
        id="technical-highlights"
        items={project.technicalHighlights}
      />
      <DetailList
        heading="Key decisions"
        id="key-decisions"
        items={project.keyDecisions}
      />

      <section className="mt-10" aria-labelledby="tech-stack">
        <h2 className="text-xl font-semibold text-slate-100" id="tech-stack">
          Tech stack
        </h2>
        <ul
          aria-label={`${project.title} tech stack`}
          className="mt-4 flex flex-wrap gap-2"
        >
          {resolveSkills(project.skillIds, skillsById).map((skill) => (
            <li
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300"
              key={skill.id}
            >
              {skill.displayName}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="project-status">
        <h2
          className="text-xl font-semibold text-slate-100"
          id="project-status"
        >
          Status
        </h2>
        <p className="mt-3 leading-7 text-slate-300">{project.status}</p>
      </section>

      {project.screenshots.length > 0 ? (
        <section className="mt-10" aria-labelledby="screenshots">
          <h2 className="text-xl font-semibold text-slate-100" id="screenshots">
            Screenshots
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {project.screenshots.map((screenshot) => (
              <figure
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/65"
                key={screenshot.url}
              >
                <img
                  alt={screenshot.alt}
                  className="h-auto w-full object-cover"
                  decoding="async"
                  loading="lazy"
                  sizes="(min-width: 640px) 50vw, 100vw"
                  src={screenshot.url}
                />
                <figcaption className="px-4 py-3 text-sm text-slate-300">
                  {screenshot.alt}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
