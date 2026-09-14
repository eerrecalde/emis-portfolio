import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkillsChart } from './SkillsChart';

describe('SkillsChart', () => {
  it('renders a dot plot for the supplied skills', () => {
    render(
      <SkillsChart
        skills={[
          {
            id: 'react',
            displayName: 'React',
            yearsOfExperience: 8,
            areas: ['frontend'],
            aliases: [],
          },
          {
            id: 'typescript',
            displayName: 'TypeScript',
            yearsOfExperience: 6,
            areas: ['frontend'],
            aliases: [],
          },
        ]}
        visibleSkills={[
          {
            id: 'react',
            displayName: 'React',
            yearsOfExperience: 8,
            areas: ['frontend'],
            aliases: [],
          },
        ]}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Experience by skill' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: 'Dot plot showing years of experience for selected skills',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('8y')).toBeInTheDocument();
  });
});
