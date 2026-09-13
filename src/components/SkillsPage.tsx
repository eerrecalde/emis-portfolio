import { useEffect, useMemo, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import 'd3-transition';
import {
  skillAreas,
  type PortfolioSkill,
  type SkillArea,
} from '../types/portfolio';

const AREA_LABELS: Record<SkillArea, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  analytics: 'Analytics',
  testing: 'Testing',
  devops: 'DevOps',
  'ci-cd': 'CI/CD',
};

const CURRENT_YEAR = new Date().getFullYear();
const ROW_HEIGHT = 38;
const TOP_PADDING = 42;
const BOTTOM_PADDING = 32;
const MOBILE_LABELS: Record<string, string> = {
  'ai-assisted-engineering-workflows': 'AI workflows',
  'internationalisation-localisation': 'i18n & localisation',
  'performance-optimisation': 'Performance',
  'responsive-web-design': 'Responsive design',
};

type SkillsPageProps = { skills: PortfolioSkill[] };

export function SkillsPage({ skills }: SkillsPageProps) {
  const [activeAreas, setActiveAreas] = useState<Set<SkillArea>>(
    () => new Set(skillAreas),
  );
  const [chartWidth, setChartWidth] = useState(960);
  const chartRef = useRef<SVGSVGElement>(null);

  const availableAreas = useMemo(
    () =>
      skillAreas.filter((area) =>
        skills.some((skill) => skill.areas.includes(area)),
      ),
    [skills],
  );
  const sortedSkills = useMemo(
    () =>
      [...skills]
        .filter((skill) => !skill.hideFromSkills)
        .sort(
          (first, second) =>
            second.yearsOfExperience - first.yearsOfExperience ||
            first.displayName.localeCompare(second.displayName),
        ),
    [skills],
  );
  const visibleSkills = useMemo(
    () =>
      sortedSkills.filter((skill) =>
        skill.areas.some((area) => activeAreas.has(area)),
      ),
    [activeAreas, sortedSkills],
  );
  const visibleIndex = useMemo(
    () => new Map(visibleSkills.map((skill, index) => [skill.id, index])),
    [visibleSkills],
  );
  const chartHeight =
    TOP_PADDING +
    Math.max(visibleSkills.length, 1) * ROW_HEIGHT +
    BOTTOM_PADDING;
  const leftMargin = chartWidth < 560 ? 170 : 184;
  const rightMargin = 48;
  const start = Math.min(
    ...sortedSkills.map((skill) => startYear(skill.yearsOfExperience)),
  );
  const x = scaleLinear()
    .domain([Math.floor(start), CURRENT_YEAR])
    .range([leftMargin, Math.max(leftMargin + 40, chartWidth - rightMargin)]);

  useEffect(() => {
    const updateWidth = () =>
      setChartWidth(chartRef.current?.clientWidth || 360);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const chart = select(chartRef.current);
    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    chart
      .selectAll<SVGGElement, unknown>('[data-skill-row]')
      .interrupt()
      .transition()
      .duration(reduceMotion ? 0 : 300)
      .attr('opacity', function () {
        return visibleIndex.has(this.dataset.skillId ?? '') ? 1 : 0;
      })
      .attr('transform', function () {
        const index = visibleIndex.get(this.dataset.skillId ?? '');
        const y = TOP_PADDING + (index ?? visibleSkills.length) * ROW_HEIGHT;
        return `translate(0 ${y})`;
      });
  }, [chartHeight, visibleIndex, visibleSkills.length]);

  function toggleArea(area: SkillArea) {
    setActiveAreas((current) => {
      const next = new Set(current);
      if (next.has(area)) {
        next.delete(area);
      } else {
        next.add(area);
      }
      return next;
    });
  }

  return (
    <>
      <header>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
          Skills
        </h1>
      </header>

      <section className="mt-8" aria-label="Filter skills by area">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-400" aria-live="polite">
            {visibleSkills.length} of {sortedSkills.length} skills shown
          </p>
          <div className="flex flex-wrap gap-2">
            {availableAreas.map((area) => {
              const isActive = activeAreas.has(area);
              return (
                <button
                  aria-pressed={isActive}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 motion-reduce:transition-none ${
                    isActive
                      ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-100'
                      : 'border-slate-700 bg-slate-950/40 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                  }`}
                  key={area}
                  onClick={() => toggleArea(area)}
                  type="button"
                >
                  {AREA_LABELS[area]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <figure className="mt-10" aria-labelledby="experience-arcs-title">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2
            className="text-xl font-semibold tracking-tight text-slate-50"
            id="experience-arcs-title"
          >
            Experience arcs
          </h2>
          <p className="text-sm text-slate-400">Years of experience</p>
        </div>
        <svg
          aria-label="Experience arcs showing years of experience for selected skills"
          className="mt-5 block w-full overflow-visible"
          ref={chartRef}
          role="img"
          style={{ height: chartHeight }}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          <title>Experience arcs for selected skills</title>
          <defs>
            <linearGradient
              id="experience-arc-gradient"
              x1="0"
              x2="1"
              y1="0"
              y2="0"
            >
              <stop offset="0" stopColor="#818cf8" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <line
            stroke="rgb(71 85 105 / 0.85)"
            strokeWidth="1"
            x1={leftMargin}
            x2={chartWidth - rightMargin}
            y1={chartHeight - BOTTOM_PADDING + 2}
            y2={chartHeight - BOTTOM_PADDING + 2}
          />
          {x.ticks(chartWidth < 560 ? 3 : 5).map((year) => (
            <g key={year} transform={`translate(${x(year)} 0)`}>
              <line
                stroke="rgb(71 85 105 / 0.55)"
                strokeWidth="1"
                y1={TOP_PADDING - 12}
                y2={chartHeight - BOTTOM_PADDING + 5}
              />
              <text
                fill="rgb(148 163 184)"
                fontSize="12"
                textAnchor="middle"
                y={chartHeight - 8}
              >
                {year}
              </text>
            </g>
          ))}
          {sortedSkills.map((skill) => {
            const visible = visibleIndex.has(skill.id);
            const y =
              TOP_PADDING +
              (visibleIndex.get(skill.id) ?? visibleSkills.length) * ROW_HEIGHT;
            const startX = x(startYear(skill.yearsOfExperience));
            const endX = x(CURRENT_YEAR);
            const arcHeight = Math.min(18, Math.max(7, (endX - startX) / 9));
            return (
              <g
                aria-hidden={!visible}
                data-skill-row=""
                data-skill-id={skill.id}
                key={skill.id}
                opacity={visible ? 1 : 0}
                transform={`translate(0 ${y})`}
              >
                <text
                  fill="rgb(226 232 240)"
                  fontSize="14"
                  textAnchor="end"
                  x={leftMargin - 14}
                  y="5"
                >
                  {chartWidth < 560
                    ? (MOBILE_LABELS[skill.id] ?? skill.displayName)
                    : skill.displayName}
                </text>
                <path
                  d={`M ${startX} 0 Q ${(startX + endX) / 2} ${-arcHeight} ${endX} 0`}
                  fill="none"
                  stroke="url(#experience-arc-gradient)"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
                <circle cx={startX} cy="0" fill="#818cf8" r="4" />
                <circle cx={endX} cy="0" fill="#22d3ee" r="4" />
                <text fill="rgb(165 243 252)" fontSize="12" x={endX + 10} y="5">
                  {formatYears(skill.yearsOfExperience)}
                </text>
              </g>
            );
          })}
        </svg>
      </figure>

      <section
        className="sr-only"
        aria-live="polite"
        aria-labelledby="visible-skills-heading"
      >
        <h2 id="visible-skills-heading">Visible skills</h2>
        <ul>
          {visibleSkills.map((skill) => (
            <li key={skill.id}>
              {skill.displayName}: {formatYears(skill.yearsOfExperience)}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function startYear(yearsOfExperience: number): number {
  return CURRENT_YEAR - yearsOfExperience;
}

function formatYears(yearsOfExperience: number): string {
  return `${yearsOfExperience < 1 ? yearsOfExperience.toFixed(1) : yearsOfExperience} ${yearsOfExperience === 1 ? 'year' : 'years'}`;
}
