import { useEffect, useRef } from 'react';
import type { LearningItem } from '../../types/portfolio';

type CourseDetailsProps = {
  item: LearningItem;
  persistent: boolean;
  onClose: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
};

export function CourseDetails({
  item,
  persistent,
  onClose,
  onPointerEnter,
  onPointerLeave,
}: CourseDetailsProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const date =
    item.status === 'completed'
      ? (item.completedDate ?? item.startDate)
      : item.startDate;

  useEffect(() => {
    if (persistent) {
      closeButton.current?.focus();
    }
  }, [persistent]);

  return (
    <div
      aria-labelledby={`course-details-${item.id}`}
      aria-modal={persistent || undefined}
      className={`course-details ${
        persistent ? 'course-details--persistent' : 'course-details--preview'
      }`}
      onClick={(event) => {
        if (persistent && event.target === event.currentTarget) {
          onClose();
        }
      }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      role="dialog"
    >
      <div className="course-details__surface">
        <div className="course-details__header">
          <p className="course-details__status">
            {item.status === 'in-progress' ? 'In progress' : 'Completed'} ·{' '}
            {formatLearningDate(date)}
          </p>
          {persistent ? (
            <button
              aria-label={`Close details for ${item.displayName}`}
              className="course-details__close"
              onClick={onClose}
              ref={closeButton}
              type="button"
            >
              ×
            </button>
          ) : null}
        </div>
        <h3 className="course-details__title" id={`course-details-${item.id}`}>
          {item.displayName}
        </h3>
        <p className="course-details__provider">
          {item.platform.name}
          {item.institution ? ` · ${item.institution.name}` : ''}
        </p>
        {item.summary ? (
          <p className="course-details__summary">{item.summary}</p>
        ) : null}
        {item.topics?.length ? (
          <ul className="course-details__topics" aria-label="Topics">
            {item.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        ) : null}
        {persistent ? (
          <p className="course-details__links">
            <a href={item.sourceUrl} rel="noreferrer" target="_blank">
              View course
            </a>
            {item.diploma ? (
              <a href={item.diploma.url} rel="noreferrer" target="_blank">
                {item.diploma.label}
              </a>
            ) : null}
          </p>
        ) : (
          <p className="course-details__hint">Select for course details</p>
        )}
      </div>
    </div>
  );
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
