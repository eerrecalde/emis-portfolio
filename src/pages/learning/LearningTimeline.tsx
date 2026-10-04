import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { LearningItem } from '../../types/portfolio';
import { formatLearningDuration } from '../../data/learning';
import { CourseDetails } from './CourseDetails';

type LearningTimelineProps = { items: LearningItem[] };

export function LearningTimeline({ items }: LearningTimelineProps) {
  const [activeCourseId, setActiveCourseId] = useState<string>();
  const [isPersistent, setIsPersistent] = useState(false);
  const isMobile = useIsMobile();
  const closeTimer = useRef<number | undefined>(undefined);
  const isPersistentRef = useRef(isPersistent);
  const courseButtons = useRef(new Map<string, HTMLButtonElement>());

  useLayoutEffect(() => {
    isPersistentRef.current = isPersistent;
  }, [isPersistent]);

  const clearCloseTimer = useCallback(() => {
    window.clearTimeout(closeTimer.current);
  }, []);

  const closeDetails = useCallback(() => {
    const closingCourseId = activeCourseId;
    clearCloseTimer();
    setActiveCourseId(undefined);
    setIsPersistent(false);

    if (closingCourseId && isPersistent) {
      courseButtons.current.get(closingCourseId)?.focus();
    }
  }, [activeCourseId, clearCloseTimer, isPersistent]);

  useEffect(() => {
    return () => window.clearTimeout(closeTimer.current);
  }, []);

  function schedulePreviewClose() {
    if (isPersistentRef.current) {
      return;
    }

    clearCloseTimer();
    closeTimer.current = window.setTimeout(
      () => setActiveCourseId(undefined),
      175,
    );
  }

  function openPreview(itemId: string) {
    if (isPersistentRef.current) {
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
    <ol className="learning-timeline" aria-label="Courses, most recent first">
      {items.map((item) => {
        const isInProgress = item.status === 'in-progress';

        return (
          <li
            className="learning-timeline__item"
            key={item.id}
            onPointerEnter={() => !isMobile && openPreview(item.id)}
            onPointerLeave={() => !isMobile && schedulePreviewClose()}
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
                  {item.totalHours
                    ? ` · ${formatLearningDuration(item.totalHours)}`
                    : ''}
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
