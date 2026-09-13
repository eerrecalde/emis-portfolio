import type { ProfessionalExperience } from '../../types/portfolio';

type ExperienceTimelineProps = { experience: ProfessionalExperience[] };

export function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  return (
    <ol className="mt-14 max-w-4xl space-y-10 border-l border-slate-700 pl-6 sm:pl-8">
      {experience.map((role) => (
        <li className="relative" key={`${role.company}-${role.startDate}`}>
          <span
            aria-hidden="true"
            className="absolute -left-[31px] top-2 size-3 rounded-full bg-violet-500 ring-4 ring-[#080d0f] sm:-left-[37px]"
          />
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-100">
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
