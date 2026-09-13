import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { ProjectDetail } from './ProjectDetail';

describe('ProjectDetail', () => {
  it('defers and sizes repository screenshots', () => {
    render(
      <MemoryRouter>
        <ProjectDetail
          project={{
            slug: 'demo',
            featured: false,
            title: 'Demo',
            summary: 'A short description.',
            whyBuilt: 'To show project decisions.',
            repositoryUrl: 'https://github.com/example/demo',
            screenshots: [
              {
                alt: 'Demo dashboard',
                url: 'https://example.com/dashboard.webp',
              },
            ],
            capabilities: ['Shows a dashboard.'],
            technicalHighlights: ['Uses responsive images.'],
            keyDecisions: ['Defer below-the-fold media.'],
            skillIds: ['typescript'],
            status: 'Ready',
          }}
          skillsById={
            new Map([
              [
                'typescript',
                {
                  id: 'typescript',
                  displayName: 'TypeScript',
                  yearsOfExperience: 6,
                  aliases: ['ts'],
                },
              ],
            ])
          }
        />
      </MemoryRouter>,
    );

    const screenshot = screen.getByRole('img', { name: 'Demo dashboard' });

    expect(screenshot).toHaveAttribute('loading', 'lazy');
    expect(screenshot).toHaveAttribute('decoding', 'async');
    expect(screenshot).toHaveAttribute(
      'sizes',
      '(min-width: 640px) 50vw, 100vw',
    );
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });
});
