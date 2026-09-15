import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LearningPage } from './LearningPage';

describe('LearningPage', () => {
  it('provides a clear empty-state foundation before courses are published', () => {
    render(<LearningPage items={[]} />);

    expect(
      screen.getByRole('heading', { name: 'Learning record' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Course entries will appear here as they are published.',
      ),
    ).toBeInTheDocument();
  });

  it('summarises published learning entries', () => {
    render(
      <LearningPage
        items={[
          {
            id: 'completed-course',
            displayName: 'Completed course',
            status: 'completed',
            startDate: '2026-07',
            completedDate: '2026-07',
            platform: { name: 'Provider' },
            sourceUrl: 'https://example.com/course',
          },
        ]}
      />,
    );

    expect(screen.getByText('1 course, 1 completed')).toBeInTheDocument();
  });
});
