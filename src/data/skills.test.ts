import { describe, expect, it } from 'vitest';
import { resolveSkills } from './skills';
import type { PortfolioSkill } from '../types/portfolio';

describe('resolveSkills', () => {
  it('keeps the project-defined order and ignores missing IDs', () => {
    const skillsById = new Map<string, PortfolioSkill>([
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
    ]);

    expect(
      resolveSkills(['typescript', 'missing', 'react'], skillsById),
    ).toEqual([skillsById.get('typescript'), skillsById.get('react')]);
  });
});
