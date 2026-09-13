import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkillsPage } from './SkillsPage';

describe('SkillsPage', () => {
  it('starts with every available area selected and filters skills as areas are turned off', () => {
    render(
      <SkillsPage
        skills={[
          {
            id: 'react',
            displayName: 'React',
            yearsOfExperience: 8,
            areas: ['frontend'],
            aliases: [],
          },
          {
            id: 'vitest',
            displayName: 'Vitest',
            yearsOfExperience: 1,
            areas: ['testing', 'ci-cd'],
            aliases: [],
          },
        ]}
      />,
    );

    const frontend = screen.getByRole('button', { name: 'Frontend' });
    const testing = screen.getByRole('button', { name: 'Testing' });

    expect(frontend).toHaveAttribute('aria-pressed', 'true');
    expect(testing).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('2 of 2 skills shown')).toBeInTheDocument();

    fireEvent.click(frontend);
    expect(frontend).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('1 of 2 skills shown')).toBeInTheDocument();
    expect(screen.getByText('Vitest: 1 year')).toBeInTheDocument();
  });
});
