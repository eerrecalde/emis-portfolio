import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ExperiencePage } from './ExperiencePage';

describe('ExperiencePage', () => {
  it('displays each role and its date range', () => {
    render(
      <ExperiencePage
        experience={[
          {
            company: 'Example Co',
            title: 'Senior Frontend Engineer',
            startDate: '2024-01',
            endDate: '2025-12',
            location: 'London, United Kingdom',
            highlights: ['Led an accessible account journey.'],
          },
        ]}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Professional experience' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Senior Frontend Engineer',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Jan 2024 – Dec 2025')).toBeInTheDocument();
    expect(screen.getByText('Example Co')).toBeInTheDocument();
  });
});
