import type { LearningItem } from '../../types/portfolio';

type LearningTimelineProps = { items: LearningItem[] };

export function LearningTimeline({ items }: LearningTimelineProps) {
  return (
    <ol className="learning-timeline" aria-label="Courses in chronological order">
      <svg
        aria-hidden="true"
        className="learning-timeline__path"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d={createTimelinePath(items.length)}
          pathLength="1"
        />
      </svg>

      {items.map((item, index) => {
        const isInProgress = item.status === 'in-progress';

        return (
          <li
            className={`learning-timeline__item ${
              index % 2 === 0
                ? 'learning-timeline__item--start'
                : 'learning-timeline__item--end'
            }`}
            key={item.id}
          >
            <article
              className={`learning-timeline__node ${
                isInProgress
                  ? 'learning-timeline__node--in-progress'
                  : 'learning-timeline__node--completed'
              }`}
            >
              <span className="learning-timeline__marker" aria-hidden="true" />
              <p className="learning-timeline__date">
                {formatLearningDate(milestoneDate(item))}
              </p>
              <h2 className="learning-timeline__title">{item.displayName}</h2>
              <p className="learning-timeline__meta">
                {isInProgress ? 'In progress' : 'Completed'} · {item.platform.name}
                {item.diploma ? ' · Credential' : ''}
              </p>
            </article>
          </li>
        );
      })}
    </ol>
  );
}

function milestoneDate(item: LearningItem) {
  return item.status === 'completed'
    ? (item.completedDate ?? item.startDate)
    : item.startDate;
}

function formatLearningDate(value: string) {
  const [year, month] = value.split('-');
  const date = new Date(Date.UTC(Number(year), Number(month) - 1));

  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function createTimelinePath(itemCount: number) {
  if (itemCount < 2) {
    return 'M 8 0 L 8 100';
  }

  const points = Array.from({ length: itemCount }, (_, index) => ({
    x: index % 2 === 0 ? 8 : 92,
    y: (index / (itemCount - 1)) * 100,
  }));

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const controlY = (previous.y + point.y) / 2;

    return `${path} C ${previous.x} ${controlY}, ${point.x} ${controlY}, ${point.x} ${point.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
}
