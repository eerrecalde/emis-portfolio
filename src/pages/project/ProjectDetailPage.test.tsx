import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { ProjectDetailPage } from './ProjectDetailPage';

afterEach(cleanup);

describe('ProjectDetailPage', () => {
  it('defers and sizes repository screenshots', () => {
    render(
      <MemoryRouter>
        <ProjectDetailPage
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
                  areas: ['frontend'],
                  aliases: ['ts'],
                },
              ],
            ])
          }
        />
      </MemoryRouter>,
    );

    const screenshot = screen.getByRole('img', { name: 'Demo dashboard' });

    expect(screen.getByRole('heading', { name: 'Demo' })).toHaveClass(
      'text-3xl',
      'font-normal',
      'sm:text-4xl',
    );

    expect(screenshot).toHaveAttribute('loading', 'lazy');
    expect(screenshot).toHaveAttribute('decoding', 'async');
    expect(screenshot).toHaveAttribute(
      'sizes',
      '(min-width: 640px) 50vw, 100vw',
    );
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('does not show a repository link for a private project', () => {
    render(
      <MemoryRouter>
        <ProjectDetailPage
          project={{
            slug: 'private-project',
            featured: false,
            title: 'Private Project',
            summary: 'A private case study.',
            whyBuilt: 'To show work that cannot be linked publicly.',
            screenshots: [],
            capabilities: ['Shows the project story.'],
            technicalHighlights: ['Keeps the repository private.'],
            keyDecisions: ['Omits an external link.'],
            skillIds: [],
            status: 'Delivered privately.',
          }}
          skillsById={new Map()}
        />
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole('link', { name: 'View repository' }),
    ).not.toBeInTheDocument();
  });
});
