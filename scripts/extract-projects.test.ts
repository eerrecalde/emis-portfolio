import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  decodeReadme,
  extractReadmeScreenshots,
  parseRepositoryUrl,
  runExtraction,
} from './extract-projects';

const repositoryUrl = 'https://github.com/owner/demo';
const readmeUrl = 'https://raw.githubusercontent.com/owner/demo/main/README.md';

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

  it('collects deduplicated HTTPS screenshots with their alt text', () => {
    const screenshots = extractReadmeScreenshots(
      '![Dashboard](./docs/dashboard.webp)\n![External](https://example.com/cover.png)\n![Unsafe](javascript:alert(1))\n![Dashboard](./docs/dashboard.webp)',
      readmeUrl,
    );

    expect(screenshots).toEqual([
      {
        alt: 'Dashboard',
        url: 'https://raw.githubusercontent.com/owner/demo/main/docs/dashboard.webp',
      },
      { alt: 'External', url: 'https://example.com/cover.png' },
    ]);
  });
});

describe('runExtraction', () => {
  it('writes the small curated source contract after README requests succeed', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'portfolio-extract-'));
    const configPath = join(directory, 'projects.config.json');
    const schemaPath = join(directory, 'schema.json');
    const outputPath = join(directory, 'projects.json');
    await writeFile(
      configPath,
      JSON.stringify({
        $schema: './schema.json',
        projects: [{ slug: 'demo', repositoryUrl, featured: false }],
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
    const fetchImpl = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            content: 'IyBEZW1vCiFbRGFzaGJvYXJkXSguL2RvY3MvZGFzaGJvYXJkLndlYnAp',
            encoding: 'base64',
            download_url: readmeUrl,
          }),
          { status: 200 },
        ),
    ) as unknown as typeof fetch;

    await expect(
      runExtraction({ configPath, schemaPath, outputPath, fetchImpl }),
    ).resolves.toEqual({
      projects: [
        {
          slug: 'demo',
          featured: false,
          repositoryUrl,
          readme: '# Demo\n![Dashboard](./docs/dashboard.webp)',
          screenshots: [
            {
              alt: 'Dashboard',
              url: 'https://raw.githubusercontent.com/owner/demo/main/docs/dashboard.webp',
            },
          ],
        },
      ],
    });
    await expect(readFile(outputPath, 'utf8')).resolves.toContain(
      '"repositoryUrl": "https://github.com/owner/demo"',
    );
  });

  it('fails without replacing output when the README request fails', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'portfolio-extract-'));
    const configPath = join(directory, 'projects.config.json');
    const schemaPath = join(directory, 'schema.json');
    const outputPath = join(directory, 'projects.json');
    await writeFile(
      configPath,
      JSON.stringify({
        projects: [{ slug: 'demo', repositoryUrl, featured: false }],
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
    ).rejects.toThrow('GitHub README request failed');
    await expect(readFile(outputPath, 'utf8')).resolves.toBe('previous output');
  });
});
