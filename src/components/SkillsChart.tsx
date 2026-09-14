import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import 'd3-transition';
import type { PortfolioSkill } from '../types/portfolio';
import { formatYears } from '../utils/formatYears';

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
  const previousGridEnd = useRef(TOP_PADDING - 12);
  const visibleIndex = useMemo(
    () => new Map(visibleSkills.map((skill, index) => [skill.id, index])),
    [visibleSkills],
  );
  const chartHeight =
    TOP_PADDING +
    Math.max(visibleSkills.length, 1) * ROW_HEIGHT +
    BOTTOM_PADDING;
  const leftMargin = chartWidth < 560 ? 170 : 250;
  const rightMargin = 72;
  const maximumExperience = Math.max(
    ...skills.map((skill) => skill.yearsOfExperience),
  );
  const x = scaleLinear()
    .domain([0, maximumExperience])
    .range([leftMargin, Math.max(leftMargin + 40, chartWidth - rightMargin)]);

  useEffect(() => {
    const updateWidth = () =>
      setChartWidth(chartRef.current?.clientWidth || 360);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useLayoutEffect(() => {
    const chart = select(chartRef.current);
    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const rows = chart.selectAll<SVGGElement, unknown>('[data-skill-row]');
    rows
      .filter(function () {
        return !this.hasAttribute('transform');
      })
      .attr('transform', `translate(0 ${TOP_PADDING})`);

    const visibleRows = rows.filter(function () {
      return visibleIndex.has(this.dataset.skillId ?? '');
    });
    const hiddenRows = rows.filter(function () {
      return !visibleIndex.has(this.dataset.skillId ?? '');
    });
    const canAnimateRowPosition =
      !reduceMotion && rows.node()?.transform?.baseVal !== undefined;

    if (canAnimateRowPosition) {
      visibleRows
        .interrupt()
        .transition()
        .duration(300)
        .attr('opacity', 1)
        .attr('transform', function () {
          const index = visibleIndex.get(this.dataset.skillId ?? '');
          return `translate(0 ${TOP_PADDING + (index ?? 0) * ROW_HEIGHT})`;
        });
    } else {
      visibleRows
        .interrupt()
        .attr('opacity', 1)
        .attr('transform', function () {
          const index = visibleIndex.get(this.dataset.skillId ?? '');
          return `translate(0 ${TOP_PADDING + (index ?? 0) * ROW_HEIGHT})`;
        });
    }

    hiddenRows.interrupt().attr('opacity', 0);

    visibleRows
      .select<SVGLineElement>('[data-skill-progress]')
      .interrupt()
      .attr('x2', leftMargin)
      .transition()
      .delay((_, index) => (reduceMotion ? 0 : index * 20))
      .duration(reduceMotion ? 0 : 420)
      .attr('x2', function () {
        return Number(this.dataset.endpoint);
      });

    visibleRows
      .select<SVGCircleElement>('[data-skill-dot]')
      .interrupt()
      .attr('cx', leftMargin)
      .transition()
      .delay((_, index) => (reduceMotion ? 0 : index * 20))
      .duration(reduceMotion ? 0 : 420)
      .attr('cx', function () {
        return Number(this.dataset.endpoint);
      });

    visibleRows
      .select<SVGTextElement>('[data-skill-value]')
      .interrupt()
      .attr('opacity', 0)
      .transition()
      .delay((_, index) => (reduceMotion ? 0 : 250 + index * 20))
      .duration(reduceMotion ? 0 : 180)
      .attr('opacity', 1);

    const gridEnd = chartHeight - BOTTOM_PADDING + 5;
    chart
      .selectAll<SVGLineElement, unknown>('[data-chart-gridline]')
      .interrupt()
      .attr('y2', previousGridEnd.current)
      .transition()
      .duration(reduceMotion ? 0 : 300)
      .attr('y2', gridEnd);
    previousGridEnd.current = gridEnd;
  }, [chartHeight, leftMargin, visibleIndex, visibleSkills.length]);

  return (
    <figure className="mt-10" aria-labelledby="experience-by-skill-title">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2
          className="text-xl font-semibold tracking-tight text-slate-100"
          id="experience-by-skill-title"
        >
          Experience by skill
        </h2>
        <p className="text-sm text-slate-400">Years of experience</p>
      </div>
      <div
        className="mt-5 overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none"
        style={{ height: chartHeight }}
      >
        <svg
          aria-label="Dot plot showing years of experience for selected skills"
          className="block w-full overflow-visible"
          ref={chartRef}
          role="img"
          style={{ height: chartHeight }}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          <title>Years of experience by skill</title>
          <line
            stroke="rgb(71 85 105 / 0.85)"
            strokeWidth="1"
            x1={leftMargin}
            x2={chartWidth - rightMargin}
            y1={chartHeight - BOTTOM_PADDING + 2}
            y2={chartHeight - BOTTOM_PADDING + 2}
          />
          {x.ticks(chartWidth < 560 ? 3 : 5).map((years) => (
            <g key={years} transform={`translate(${x(years)} 0)`}>
              <line
                data-chart-gridline=""
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
                {years}
              </text>
            </g>
          ))}
          {skills.map((skill) => {
            const visible = visibleIndex.has(skill.id);
            const endpoint = x(skill.yearsOfExperience);
            return (
              <g
                aria-hidden={!visible}
                className="transition-opacity duration-200 ease-out motion-reduce:transition-none"
                data-skill-id={skill.id}
                data-skill-row=""
                key={skill.id}
                opacity={visible ? 1 : 0}
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
                <line
                  stroke="rgb(100 116 139 / 0.6)"
                  strokeLinecap="round"
                  strokeWidth="2"
                  x1={leftMargin}
                  x2={chartWidth - rightMargin}
                  y1="0"
                  y2="0"
                />
                <line
                  data-endpoint={endpoint}
                  data-skill-progress=""
                  stroke="#818cf8"
                  strokeLinecap="round"
                  strokeWidth="4"
                  x1={leftMargin}
                  x2={endpoint}
                  y1="0"
                  y2="0"
                />
                <circle
                  cx={endpoint}
                  cy="0"
                  data-endpoint={endpoint}
                  data-skill-dot=""
                  fill="#22d3ee"
                  r="6"
                />
                <text
                  data-skill-value=""
                  fill="rgb(165 243 252)"
                  fontSize="12"
                  x={endpoint + 12}
                  y="5"
                >
                  {formatYears(skill.yearsOfExperience)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
