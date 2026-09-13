import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('lists every curated project', () => {
    render(
      <MemoryRouter>
        <HomePage
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
              skillIds: ['typescript'],
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
              skillIds: ['react'],
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
              [
                'react',
                {
                  id: 'react',
                  displayName: 'React',
                  yearsOfExperience: 8,
                  areas: ['frontend'],
                  aliases: ['reactjs'],
                },
              ],
            ])
          }
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Selected projects' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Frontend | Product | Full-stack Engineer',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Featured Project' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Other Project' }),
    ).toBeInTheDocument();
  });
});
