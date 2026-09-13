import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildPortfolioContent,
  normalizeProject,
  runIngestion,
} from './ingest-portfolio';

const fixturePath = (...segments: string[]) =>
  resolve('scripts', 'fixtures', ...segments);

describe('portfolio ingestion', () => {
  it('normalizes the curated README fixture and preserves its approved assets', async () => {
    const outputDirectory = await mkdtemp(join(tmpdir(), 'portfolio-ingest-'));
    const outputPath = join(outputDirectory, 'portfolio.json');

    await expect(
      runIngestion({
        curatedProjectsPath: fixturePath('curated-projects.json'),
        professionalExperiencePath: fixturePath('professional-experience.json'),
        skillsPath: fixturePath('skills.json'),
        outputPath,
      }),
    ).resolves.toEqual({
      projects: [
        {
          slug: 'demo-project',
          title: 'Demo Project',
          summary: 'Demo Project helps teams plan dependable deliveries.',
          whyBuilt:
            'I wanted to explore how a focused workflow can reduce delivery risk.',
          featured: true,
          repositoryUrl: 'https://github.com/example/demo-project',
          screenshots: [
            {
              alt: 'Demo project dashboard',
              url: 'https://example.com/demo-project.png',
            },
          ],
          capabilities: [
            'Creates a clear delivery plan.',
            'Keeps risks visible.',
          ],
          technicalHighlights: [
            'Focused architecture. Keeps domain logic separate from page composition.',
          ],
          keyDecisions: ['Uses static data to keep builds repeatable.'],
          skillIds: ['react', 'typescript'],
          status: 'The prototype is ready for portfolio review.',
        },
      ],
      skills: [
        {
          id: 'react',
          displayName: 'React',
          yearsOfExperience: 8,
          areas: ['frontend'],
          aliases: ['reactjs'],
        },
        {
          id: 'typescript',
          displayName: 'TypeScript',
          yearsOfExperience: 6,
          areas: ['frontend'],
          hideFromSkills: true,
          aliases: ['ts'],
        },
      ],
      experience: [
        {
          company: 'Example Co',
          title: 'Senior Frontend Engineer',
          startDate: '2024-01',
          endDate: '2025-12',
          location: 'London, United Kingdom',
          highlights: ['Led an accessible account-management journey.'],
        },
      ],
    });

    await expect(readFile(outputPath, 'utf8')).resolves.toContain(
      '"Demo Project"',
    );
    await expect(
      readFile(join(outputDirectory, 'home.json'), 'utf8'),
    ).resolves.toContain('"summary"');
    await expect(
      readFile(join(outputDirectory, 'project-details.json'), 'utf8'),
    ).resolves.toContain('"technicalHighlights"');
  });

  it('rejects a curated project without a title', () => {
    expect(() =>
      normalizeProject({
        slug: 'untitled',
        featured: false,
        repositoryUrl: 'https://github.com/example/untitled',
        readme: 'A README without a Markdown title.',
        screenshots: [],
        skillIds: [],
      }),
    ).toThrow('Curated README for untitled must start with a title.');
  });

  it('rejects a project that references a missing skill', () => {
    expect(() =>
      buildPortfolioContent(
        {
          projects: [
            {
              slug: 'missing-skill',
              featured: false,
              repositoryUrl: 'https://github.com/example/missing-skill',
              readme: '# Missing Skill',
              screenshots: [],
              skillIds: ['missing-skill'],
            },
          ],
        },
        { experience: [] },
        { skills: [] },
      ),
    ).toThrow(
      'Project missing-skill references unknown skills: missing-skill.',
    );
  });
});
