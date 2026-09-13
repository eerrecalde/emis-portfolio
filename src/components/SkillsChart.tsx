import { useEffect, useMemo, useRef, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import 'd3-transition';
import type { PortfolioSkill } from '../types/portfolio';
import { formatYears } from '../utils/formatYears';

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

type SkillsChartProps = {
  skills: PortfolioSkill[];
  visibleSkills: PortfolioSkill[];
};

export function SkillsChart({ skills, visibleSkills }: SkillsChartProps) {
  const [chartWidth, setChartWidth] = useState(960);
  const chartRef = useRef<SVGSVGElement>(null);
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
    ...skills.map((skill) => startYear(skill.yearsOfExperience)),
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

  return (
    <figure className="mt-10" aria-labelledby="experience-arcs-title">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2
          className="text-xl font-semibold tracking-tight text-slate-100"
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
        {skills.map((skill) => {
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
              data-skill-id={skill.id}
              data-skill-row=""
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
  );
}

function startYear(yearsOfExperience: number): number {
  return CURRENT_YEAR - yearsOfExperience;
}
