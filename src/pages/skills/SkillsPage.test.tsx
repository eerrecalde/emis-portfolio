import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router';
import type { PortfolioSkill } from '../../types/portfolio';
import { SkillsPage } from './SkillsPage';

const skills: PortfolioSkill[] = [
  {
    id: 'react',
    displayName: 'React',
    yearsOfExperience: 8,
    areas: ['frontend', 'react'],
    aliases: [],
  },
  {
    id: 'tanstack-query',
    displayName: 'TanStack Query',
    yearsOfExperience: 1,
    areas: ['react'],
    aliases: [],
  },
  {
    id: 'vitest',
    displayName: 'Vitest',
    yearsOfExperience: 1,
    areas: ['testing', 'ci-cd'],
    aliases: [],
  },
];

afterEach(cleanup);

describe('SkillsPage', () => {
  it('shows every skill with no area selected and filters by one selected area', () => {
    window.history.pushState({}, '', '/skills');
    render(
      <BrowserRouter>
        <SkillsPage skills={skills} />
      </BrowserRouter>,
    );

    const frontend = screen.getByRole('button', { name: 'Frontend' });
    const react = screen.getByRole('button', { name: 'React' });
    const testing = screen.getByRole('button', { name: 'Testing' });

    expect(frontend).toHaveAttribute('aria-pressed', 'false');
    expect(react).toHaveAttribute('aria-pressed', 'false');
    expect(testing).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('3 of 3 skills shown')).toBeInTheDocument();

    fireEvent.click(testing);
    expect(testing).toHaveAttribute('aria-pressed', 'true');
    expect(window.location.search).toBe('?filter=testing');
    expect(screen.getByText('1 of 3 skills shown')).toBeInTheDocument();
    expect(screen.getByText('Vitest: 1 year')).toBeInTheDocument();

    fireEvent.click(react);
    expect(react).toHaveAttribute('aria-pressed', 'true');
    expect(testing).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('React: 8 years')).toBeInTheDocument();
    expect(screen.getByText('TanStack Query: 1 year')).toBeInTheDocument();
    expect(screen.getByText('2 of 3 skills shown')).toBeInTheDocument();

    fireEvent.click(react);
    expect(react).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('3 of 3 skills shown')).toBeInTheDocument();
  });

  it('restores a selected filter from the URL', () => {
    window.history.pushState({}, '', '/skills?filter=react');
    render(
      <BrowserRouter>
        <SkillsPage skills={skills} />
      </BrowserRouter>,
    );

    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('2 of 3 skills shown')).toBeInTheDocument();
  });
});
