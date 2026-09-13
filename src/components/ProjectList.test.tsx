import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectList } from './ProjectList';

describe('ProjectList', () => {
  it('renders project details and the canonical repository link', () => {
    render(
      <ProjectList
        projects={[
          {
            slug: 'demo',
            featured: false,
            repository: {
              name: 'Demo',
              fullName: 'owner/demo',
              url: 'https://github.com/owner/demo',
              description: 'A short description',
              homepage: null,
              stars: 0,
              forks: 0,
              openIssues: 0,
              defaultBranch: 'main',
              createdAt: '2025-01-01T00:00:00Z',
              updatedAt: '2025-01-01T00:00:00Z',
            },
            languages: [{ name: 'TypeScript', bytes: 10 }],
            readme: '# Demo',
            images: [],
            latestRelease: null,
          },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Demo' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'View repository' }),
    ).toHaveAttribute('href', 'https://github.com/owner/demo');
  });
});
