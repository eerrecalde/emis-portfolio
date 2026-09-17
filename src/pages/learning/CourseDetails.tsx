import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const diplomaButton = useRef<HTMLButtonElement>(null);
  const [isDiplomaOpen, setIsDiplomaOpen] = useState(false);
  const date =
    item.status === 'completed'
      ? (item.completedDate ?? item.startDate)
      : item.startDate;

  useEffect(() => {
    if (persistent) {
      closeButton.current?.focus();
    }
  }, [persistent]);

  useEffect(() => {
    if (!persistent) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose, persistent]);

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
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      }}
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
        {item.diploma && isPdf(item.diploma.url) ? (
          <p className="course-details__links">
            <button
              className="course-details__diploma-button"
              onClick={() => setIsDiplomaOpen(true)}
              ref={diplomaButton}
              type="button"
            >
              {item.diploma.label}
            </button>
          </p>
        ) : !item.diploma ? (
          <p className="course-details__hint">No certificate available</p>
        ) : null}
      </div>
      {item.diploma && isPdf(item.diploma.url) && isDiplomaOpen ? (
        <DiplomaModal
          diploma={item.diploma}
          title={item.displayName}
          onClose={() => {
            setIsDiplomaOpen(false);
            diplomaButton.current?.focus();
          }}
        />
      ) : null}
    </div>
  );
}

function DiplomaModal({
  diploma,
  title,
  onClose,
}: {
  diploma: NonNullable<LearningItem['diploma']>;
  title: string;
  onClose: () => void;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButton.current?.focus();
  }, []);

  return createPortal(
    <div
      aria-labelledby="diploma-modal-title"
      aria-modal="true"
      className="diploma-modal"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          onClose();
        }
      }}
      role="dialog"
    >
      <div className="diploma-modal__surface">
        <div className="diploma-modal__header">
          <h3 id="diploma-modal-title">{title}</h3>
          <button
            aria-label="Close diploma"
            className="diploma-modal__close"
            onClick={onClose}
            ref={closeButton}
            type="button"
          >
            ×
          </button>
        </div>
        <img
          alt={title}
          className="diploma-modal__document"
          src={diplomaPreviewUrl(diploma.url)}
        />
      </div>
    </div>,
    document.body,
  );
}

function isPdf(url: string) {
  return /\.pdf(?:$|[?#])/i.test(url);
}

function diplomaPreviewUrl(url: string) {
  return url.replace(/\.pdf(?=$|[?#])/i, '-1.jpg');
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
