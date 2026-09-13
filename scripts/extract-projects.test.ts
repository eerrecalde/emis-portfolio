import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  decodeReadme,
  extractReadmeImages,
  normalizeProject,
  parseRepositoryUrl,
  runExtraction,
} from './extract-projects';

const repository = {
  name: 'demo',
  full_name: 'owner/demo',
  html_url: 'https://github.com/owner/demo',
  description: 'A demo',
  homepage: null,
  stargazers_count: 5,
  forks_count: 2,
  open_issues_count: 1,
  default_branch: 'main',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-02T00:00:00Z',
};

describe('project extraction helpers', () => {
  it('parses canonical GitHub URLs and rejects malformed ones', () => {
    expect(parseRepositoryUrl('https://github.com/owner/demo/')).toEqual({
      owner: 'owner',
      repo: 'demo',
    });
    expect(() => parseRepositoryUrl('git@github.com:owner/demo.git')).toThrow(
      'Invalid GitHub repository URL',
    );
  });

  it('decodes base64 README content and rejects unknown encodings', () => {
    expect(decodeReadme('SGVsbG8=', 'base64')).toBe('Hello');
    expect(() => decodeReadme('Hello', 'utf8')).toThrow(
      'Unsupported README encoding',
    );
  });

  it('collects external and repository-relative README images', () => {
    const images = extractReadmeImages(
      '![Dashboard](./docs/dashboard.webp)\n![External](https://example.com/cover.png)\n![Unsafe](javascript:alert(1))\n![Dashboard](./docs/dashboard.webp)',
      'owner',
      'demo',
      'main',
    );

    expect(images).toEqual([
      'https://raw.githubusercontent.com/owner/demo/main/docs/dashboard.webp',
      'https://example.com/cover.png',
    ]);
  });

  it('normalizes API data into a deterministic profile', () => {
    const profile = normalizeProject(
      { slug: 'demo', repositoryUrl: repository.html_url, featured: true },
      repository,
      { TypeScript: 10, CSS: 10 },
      '# Demo',
      null,
    );

    expect(profile.languages).toEqual([
      { name: 'CSS', bytes: 10 },
      { name: 'TypeScript', bytes: 10 },
    ]);
    expect(profile.latestRelease).toBeNull();
    expect(profile.images).toEqual([]);
    expect(profile.repository.fullName).toBe('owner/demo');
  });
});

describe('runExtraction', () => {
  it('writes profiles only after all required requests succeed', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'portfolio-extract-'));
    const configPath = join(directory, 'projects.config.json');
    const schemaPath = join(directory, 'schema.json');
    const outputPath = join(directory, 'projects.json');
    await writeFile(
      configPath,
      JSON.stringify({
        $schema: './schema.json',
        projects: [
          { slug: 'demo', repositoryUrl: repository.html_url, featured: false },
        ],
      }),
    );
    await writeFile(
      schemaPath,
      JSON.stringify({
        type: 'object',
        additionalProperties: false,
        required: ['projects'],
        properties: { projects: { type: 'array' } },
      }),
    );
    const fetchImpl = vi.fn(async (url: string) => {
      const body = url.endsWith('/languages')
        ? { TypeScript: 10 }
        : url.endsWith('/readme')
          ? { content: 'IyBEZW1v', encoding: 'base64' }
          : url.endsWith('/releases/latest')
            ? null
            : repository;
      return new Response(body ? JSON.stringify(body) : '', {
        status: body ? 200 : 404,
      });
    }) as unknown as typeof fetch;

    await expect(
      runExtraction({ configPath, schemaPath, outputPath, fetchImpl }),
    ).resolves.toMatchObject({
      projects: [{ slug: 'demo', readme: '# Demo', latestRelease: null }],
    });
    await expect(readFile(outputPath, 'utf8')).resolves.toContain(
      '"slug": "demo"',
    );
  });

  it('fails without replacing output when a request fails', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'portfolio-extract-'));
    const configPath = join(directory, 'projects.config.json');
    const schemaPath = join(directory, 'schema.json');
    const outputPath = join(directory, 'projects.json');
    await writeFile(
      configPath,
      JSON.stringify({
        projects: [
          { slug: 'demo', repositoryUrl: repository.html_url, featured: false },
        ],
      }),
    );
    await writeFile(
      schemaPath,
      JSON.stringify({
        type: 'object',
        required: ['projects'],
        properties: { projects: { type: 'array' } },
      }),
    );
    await writeFile(outputPath, 'previous output');
    const fetchImpl = vi.fn(
      async () => new Response('', { status: 500 }),
    ) as unknown as typeof fetch;

    await expect(
      runExtraction({ configPath, schemaPath, outputPath, fetchImpl }),
    ).rejects.toThrow('GitHub API request failed');
    await expect(readFile(outputPath, 'utf8')).resolves.toBe('previous output');
  });
});
