import type { ProfessionalExperience } from '../types/portfolio';

type ExperiencePageProps = { experience: ProfessionalExperience[] };

export function ExperiencePage({ experience }: ExperiencePageProps) {
  return (
    <>
      <header className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
          Experience
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
          Professional experience
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          Frontend engineering experience across product teams, platforms, and
          customer-facing web applications.
        </p>
      </header>

      <ol className="mt-14 max-w-4xl space-y-10 border-l border-slate-700 pl-6 sm:pl-8">
        {experience.map((role) => (
          <li className="relative" key={`${role.company}-${role.startDate}`}>
            <span
              className="absolute -left-[31px] top-2 size-3 rounded-full bg-violet-500 ring-4 ring-[#080d0f] sm:-left-[37px]"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-50">
                {role.title}
              </h2>
              <p className="shrink-0 text-sm text-slate-400">
                {formatDateRange(role.startDate, role.endDate)}
              </p>
            </div>
            <p className="mt-2 font-medium text-cyan-200">{role.company}</p>
            <p className="mt-1 text-sm text-slate-400">{role.location}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-300 marker:text-violet-400">
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
