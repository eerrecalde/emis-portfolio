import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { LearningItem } from '../../types/portfolio';
import { LearningTimeline } from './LearningTimeline';

const items: LearningItem[] = [
  {
    id: 'completed-course',
    displayName: 'Completed course',
    status: 'completed',
    startDate: '2026-07',
    completedDate: '2026-08',
    platform: { name: 'Provider' },
    sourceUrl: 'https://example.com/completed',
    diploma: { label: 'Certificate', url: 'https://example.com/certificate' },
  },
  {
    id: 'current-course',
    displayName: 'Current course',
    status: 'in-progress',
    startDate: '2026-09',
    platform: { name: 'Provider' },
    sourceUrl: 'https://example.com/current',
  },
];

afterEach(cleanup);

describe('LearningTimeline', () => {
  it('renders chronological course nodes with their milestone dates', () => {
    render(<LearningTimeline items={items} />);

    expect(
      screen.getByRole('list', { name: 'Courses in chronological order' }),
    ).toHaveTextContent('Aug 2026');
    expect(screen.getByRole('heading', { name: 'Completed course' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Current course' })).toBeInTheDocument();
  });

  it('communicates credentials and active study without relying on colour', () => {
    render(<LearningTimeline items={items} />);

    expect(screen.getByText('Completed · Provider · Credential')).toBeInTheDocument();
    expect(screen.getByText('In progress · Provider')).toBeInTheDocument();
  });
});
