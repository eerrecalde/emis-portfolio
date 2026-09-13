import type { PortfolioProject } from '../types/portfolio';
import { Link } from 'react-router';

type ProjectDetailProps = { project: PortfolioProject };

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <article className="max-w-4xl">
      <Link
        className="text-sm font-medium text-indigo-700 hover:text-indigo-900 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700"
        to="/projects"
      >
        Back to selected work
      </Link>
      <header className="mt-8 border-b border-slate-200 pb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          {project.summary}
        </p>
        <a
          className="mt-6 inline-flex rounded-md bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700"
          href={project.repositoryUrl}
        >
          View repository
        </a>
      </header>

      <section className="mt-10" aria-labelledby="why-built">
        <h2 className="text-xl font-semibold" id="why-built">
          Why I built it
        </h2>
        <p className="mt-3 leading-7 text-slate-600">{project.whyBuilt}</p>
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
        <h2 className="text-xl font-semibold" id="tech-stack">
          Tech stack
        </h2>
        <ul
          className="mt-4 flex flex-wrap gap-2"
          aria-label={`${project.title} tech stack`}
        >
          {project.techStack.map((technology) => (
            <li
              className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
              key={technology}
            >
              {technology}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="project-status">
        <h2 className="text-xl font-semibold" id="project-status">
          Status
        </h2>
        <p className="mt-3 leading-7 text-slate-600">{project.status}</p>
      </section>

      {project.screenshots.length > 0 ? (
        <section className="mt-10" aria-labelledby="screenshots">
          <h2 className="text-xl font-semibold" id="screenshots">
            Screenshots
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {project.screenshots.map((screenshot) => (
              <figure
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                key={screenshot.url}
              >
                <img
                  alt={screenshot.alt}
                  className="h-auto w-full"
                  loading="lazy"
                  src={screenshot.url}
                />
                <figcaption className="px-4 py-3 text-sm text-slate-600">
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

type DetailListProps = { heading: string; id: string; items: string[] };

function DetailList({ heading, id, items }: DetailListProps) {
  return (
    <section className="mt-10" aria-labelledby={id}>
      <h2 className="text-xl font-semibold" id={id}>
        {heading}
      </h2>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
