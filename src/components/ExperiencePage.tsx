import type { ProfessionalExperience } from '../types/portfolio';

type ExperiencePageProps = { experience: ProfessionalExperience[] };

export function ExperiencePage({ experience }: ExperiencePageProps) {
  return (
    <>
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-indigo-700">Experience</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Professional experience
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Frontend engineering experience across product teams, platforms, and
          customer-facing web applications.
        </p>
      </header>

      <ol className="mt-16 max-w-4xl space-y-8 border-l border-slate-200 pl-6">
        {experience.map((role) => (
          <li className="relative" key={`${role.company}-${role.startDate}`}>
            <span
              className="absolute -left-[31px] top-2 size-3 rounded-full bg-indigo-700 ring-4 ring-slate-50"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <h2 className="text-lg font-semibold text-slate-950">
                {role.title}
              </h2>
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
