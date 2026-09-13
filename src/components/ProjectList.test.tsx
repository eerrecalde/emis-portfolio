import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ProjectList } from './ProjectList';

describe('ProjectList', () => {
  it('renders project details and the canonical repository link', () => {
    render(
      <MemoryRouter>
        <ProjectList
          projects={[
            {
              slug: 'demo',
              featured: false,
              title: 'Demo',
              summary: 'A short description',
              whyBuilt: 'To prove the project detail route.',
              repositoryUrl: 'https://github.com/owner/demo',
              screenshots: [
                {
                  alt: 'Demo dashboard',
                  url: 'https://example.com/dashboard.webp',
                },
              ],
              capabilities: [],
              technicalHighlights: [],
              keyDecisions: [],
              skillIds: ['typescript'],
              status: 'Ready',
            },
          ]}
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

    expect(screen.getByRole('heading', { name: 'Demo' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'View project: Demo' }),
    ).toHaveAttribute('href', '/projects/demo');
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Demo dashboard' })).toHaveAttribute(
      'loading',
      'lazy',
    );
    expect(screen.getByRole('img', { name: 'Demo dashboard' })).toHaveAttribute(
      'decoding',
      'async',
    );
  });
});
