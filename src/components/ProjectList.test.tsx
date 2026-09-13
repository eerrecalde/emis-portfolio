import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ProjectList } from './ProjectList';

describe('ProjectList', () => {
  it('renders project previews with a route to each detail page', () => {
    render(
      <MemoryRouter>
        <ProjectList
          projects={[
            {
              slug: 'demo',
              featured: false,
              title: 'Demo',
              summary: 'A short description',
              screenshots: [
                {
                  alt: 'Demo dashboard',
                  url: 'https://example.com/dashboard.webp',
                },
              ],
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
    expect(screen.getAllByRole('link')).toHaveLength(1);
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
