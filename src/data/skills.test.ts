import { describe, expect, it } from 'vitest';
import { resolveSkills } from './skills';

describe('resolveSkills', () => {
  it('keeps the project-defined order and ignores missing IDs', () => {
    const skillsById = new Map([
      [
        'react',
        {
          id: 'react',
          displayName: 'React',
          yearsOfExperience: 8,
          aliases: ['reactjs'],
        },
      ],
      [
        'typescript',
        {
          id: 'typescript',
          displayName: 'TypeScript',
          yearsOfExperience: 6,
          aliases: ['ts'],
        },
      ],
    ]);

    expect(
      resolveSkills(['typescript', 'missing', 'react'], skillsById),
    ).toEqual([skillsById.get('typescript'), skillsById.get('react')]);
  });
});
