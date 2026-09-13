import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('shows professional experience and only featured projects', () => {
    render(
      <MemoryRouter>
        <HomePage
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
          projects={[
            {
              slug: 'featured-project',
              featured: true,
              title: 'Featured Project',
              summary: 'A featured project summary.',
              whyBuilt: 'To prove the homepage composition.',
              repositoryUrl: 'https://github.com/example/featured-project',
              screenshots: [],
              capabilities: [],
              technicalHighlights: [],
              keyDecisions: [],
              techStack: ['TypeScript'],
              status: 'Ready',
            },
            {
              slug: 'other-project',
              featured: false,
              title: 'Other Project',
              summary: 'This project is not featured.',
              whyBuilt: 'To prove the homepage filtering.',
              repositoryUrl: 'https://github.com/example/other-project',
              screenshots: [],
              capabilities: [],
              technicalHighlights: [],
              keyDecisions: [],
              techStack: ['React'],
              status: 'Ready',
            },
          ]}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Emiliano Errecalde' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Professional experience' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Example Co')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Featured Project' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Other Project')).not.toBeInTheDocument();
  });
});
