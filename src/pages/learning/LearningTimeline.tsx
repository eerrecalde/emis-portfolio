import type { LearningItem } from '../../types/portfolio';

type LearningTimelineProps = { items: LearningItem[] };

export function LearningTimeline({ items }: LearningTimelineProps) {
  const totalRows = Math.ceil(items.length / 2);

  return (
    <ol
      className="learning-timeline"
      aria-label="Courses in chronological order"
    >
      <svg
        aria-hidden="true"
        className="learning-timeline__path"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path d={createTimelinePath(items.length)} pathLength="1" />
      </svg>

      {items.map((item, index) => {
        const isInProgress = item.status === 'in-progress';
        const position = timelinePosition(index, totalRows);

        return (
          <li
            className={`learning-timeline__item ${
              position.isRight
                ? 'learning-timeline__item--right'
                : 'learning-timeline__item--left'
            }`}
            key={item.id}
            style={{
              gridColumn: position.isRight ? '7 / span 6' : '1 / span 6',
              gridRow: position.row,
            }}
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
                {isInProgress ? 'In progress' : 'Completed'} ·{' '}
                {item.platform.name}
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
  if (itemCount === 0) {
    return '';
  }

  const totalRows = Math.ceil(itemCount / 2);
  const points = Array.from({ length: itemCount }, (_, index) => {
    const position = timelinePosition(index, totalRows);

    return {
      x: position.isRight ? 92 : 8,
      y: ((position.row - 0.5) / totalRows) * 100,
    };
  });

  return points.slice(1).reduce((path, point) => {
    return `${path} L ${point.x} ${point.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
}

function timelinePosition(index: number, totalRows: number) {
  const rowFromBottom = Math.floor(index / 2);
  const isMovingLeft = rowFromBottom % 2 === 0;
  const isFirstInRow = index % 2 === 0;

  return {
    isRight: isMovingLeft === isFirstInRow,
    row: totalRows - rowFromBottom,
  };
}
