import type {
  PortfolioProject,
  ProfessionalExperience,
} from '../types/portfolio';
import { ProjectList } from './ProjectList';

type HomePageProps = {
  projects: PortfolioProject[];
  experience: ProfessionalExperience[];
};

export function HomePage({ projects, experience }: HomePageProps) {
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <>
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-indigo-700">Portfolio</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Emiliano Errecalde
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Senior frontend engineer building accessible, maintainable web
          products with product and engineering teams.
        </p>
        <a
          className="mt-7 inline-flex rounded-md bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700"
          href="#featured-projects"
        >
          View featured project
        </a>
      </header>

      <section className="mt-16 max-w-4xl" aria-labelledby="experience-heading">
        <h2
          className="text-2xl font-semibold tracking-tight text-slate-950"
          id="experience-heading"
        >
          Professional experience
        </h2>
        <ol className="mt-8 space-y-8 border-l border-slate-200 pl-6">
          {experience.map((role) => (
            <li className="relative" key={`${role.company}-${role.startDate}`}>
              <span
                className="absolute -left-[31px] top-2 size-3 rounded-full bg-indigo-700 ring-4 ring-slate-50"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 className="text-lg font-semibold text-slate-950">
                  {role.title}
                </h3>
                <p className="shrink-0 text-sm text-slate-500">
                  {formatDateRange(role.startDate, role.endDate)}
                </p>
              </div>
              <p className="mt-1 font-medium text-slate-700">{role.company}</p>
              <p className="mt-1 text-sm text-slate-500">{role.location}</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-slate-600">
                {role.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="mt-16"
        id="featured-projects"
        aria-labelledby="featured-projects-heading"
      >
        <h2
          className="text-2xl font-semibold tracking-tight text-slate-950"
          id="featured-projects-heading"
        >
          Featured project
        </h2>
        <p className="mt-2 leading-7 text-slate-600">
          A project selected for its product and engineering depth.
        </p>
        {featuredProjects.length > 0 ? (
          <div className="mt-8">
            <ProjectList headingLevel="h3" projects={featuredProjects} />
          </div>
        ) : (
          <p className="mt-8 text-slate-600">No featured projects yet.</p>
        )}
      </section>
    </>
  );
}

function formatDateRange(startDate: string, endDate: string): string {
  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
}

function formatDate(value: string): string {
  const [year, month] = value.split('-');
  const date = new Date(Date.UTC(Number(year), Number(month) - 1));

  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
