import { useEffect, useRef } from 'react';
import type { LearningItem } from '../../types/portfolio';

type CourseDetailsProps = {
  item: LearningItem;
  persistent: boolean;
  modal: boolean;
  onClose: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
};

export function CourseDetails({
  item,
  persistent,
  modal,
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
      aria-modal={persistent && modal ? true : undefined}
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
          <button
            aria-label={`Close details for ${item.displayName}`}
            className="course-details__close"
            onClick={onClose}
            ref={closeButton}
            type="button"
          >
            ×
          </button>
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
        {item.diploma ? (
          <p className="course-details__links">
            <a href={item.diploma.url} rel="noreferrer" target="_blank">
              {item.diploma.label}
            </a>
          </p>
        ) : (
          <p className="course-details__hint">No certificate available</p>
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
