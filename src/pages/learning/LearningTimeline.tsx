import { useCallback, useEffect, useRef, useState } from 'react';
import type { LearningItem } from '../../types/portfolio';
import { CourseDetails } from './CourseDetails';

type LearningTimelineProps = { items: LearningItem[] };

export function LearningTimeline({ items }: LearningTimelineProps) {
  const totalRows = Math.ceil(items.length / 2);
  const [activeCourseId, setActiveCourseId] = useState<string>();
  const [isPersistent, setIsPersistent] = useState(false);
  const isMobile = useIsMobile();
  const closeTimer = useRef<number | undefined>(undefined);
  const courseButtons = useRef(new Map<string, HTMLButtonElement>());

  const clearCloseTimer = useCallback(() => {
    window.clearTimeout(closeTimer.current);
  }, []);

  const closeDetails = useCallback(() => {
    const closingCourseId = activeCourseId;
    clearCloseTimer();
    setActiveCourseId(undefined);
    setIsPersistent(false);

    if (closingCourseId) {
      courseButtons.current.get(closingCourseId)?.focus();
    }
  }, [activeCourseId, clearCloseTimer]);

  useEffect(() => {
    return () => window.clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (!isPersistent) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeDetails();
      }
    }

    function closeOnOutsidePointer(event: PointerEvent) {
      const activeButton = activeCourseId
        ? courseButtons.current.get(activeCourseId)
        : undefined;

      if (
        activeButton &&
        !activeButton.closest('li')?.contains(event.target as Node)
      ) {
        closeDetails();
      }
    }

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
    };
  }, [activeCourseId, closeDetails, isPersistent]);

  function schedulePreviewClose() {
    if (isPersistent) {
      return;
    }

    clearCloseTimer();
    closeTimer.current = window.setTimeout(
      () => setActiveCourseId(undefined),
      175,
    );
  }

  function openPreview(itemId: string) {
    if (isPersistent) {
      return;
    }

    clearCloseTimer();
    setActiveCourseId(itemId);
  }

  function openDetails(itemId: string) {
    clearCloseTimer();
    setActiveCourseId(itemId);
    setIsPersistent(true);
  }

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
            onPointerEnter={() => !isMobile && openPreview(item.id)}
            onPointerLeave={() => !isMobile && schedulePreviewClose()}
            style={{
              gridColumn: position.isRight ? '7 / span 6' : '1 / span 6',
              gridRow: position.row,
            }}
          >
            <article className="learning-timeline__node-wrapper">
              <button
                aria-expanded={activeCourseId === item.id}
                aria-haspopup="dialog"
                aria-label={`View details for ${item.displayName}`}
                className={`learning-timeline__node ${
                  isInProgress
                    ? 'learning-timeline__node--in-progress'
                    : 'learning-timeline__node--completed'
                }`}
                onBlur={() => !isMobile && schedulePreviewClose()}
                onClick={() => openDetails(item.id)}
                onFocus={() => !isMobile && openPreview(item.id)}
                onPointerEnter={() => !isMobile && openPreview(item.id)}
                onPointerLeave={() => !isMobile && schedulePreviewClose()}
                ref={(button) => {
                  if (button) {
                    courseButtons.current.set(item.id, button);
                  } else {
                    courseButtons.current.delete(item.id);
                  }
                }}
                type="button"
              >
                <span
                  className="learning-timeline__marker"
                  aria-hidden="true"
                />
                <span className="learning-timeline__date">
                  {formatLearningDate(milestoneDate(item))}
                </span>
                <span
                  className="learning-timeline__title"
                  role="heading"
                  aria-level={2}
                >
                  {item.displayName}
                </span>
                <span className="learning-timeline__meta">
                  {isInProgress ? 'In progress' : 'Completed'} ·{' '}
                  {item.platform.name}
                  {item.diploma ? ' · Credential' : ''}
                </span>
              </button>
              {activeCourseId === item.id ? (
                <CourseDetails
                  item={item}
                  onClose={closeDetails}
                  onPointerEnter={clearCloseTimer}
                  onPointerLeave={schedulePreviewClose}
                  persistent={isPersistent}
                  modal={isMobile}
                />
              ) : null}
            </article>
          </li>
        );
      })}
    </ol>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) {
      return;
    }

    const query = window.matchMedia('(max-width: 639px)');
    const updateIsMobile = () => setIsMobile(query.matches);

    updateIsMobile();
    query.addEventListener('change', updateIsMobile);
    return () => query.removeEventListener('change', updateIsMobile);
  }, []);

  return isMobile;
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
