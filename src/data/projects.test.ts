import { describe, expect, it, vi } from 'vitest';
import { fetchProjects } from './projects';

describe('fetchProjects', () => {
  it('returns generated project data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ projects: [] }), { status: 200 }),
      ),
    );

    await expect(fetchProjects()).resolves.toEqual({ projects: [] });
    expect(fetch).toHaveBeenCalledWith('/data/projects.json');
  });

  it('reports unsuccessful responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('', { status: 503 })),
    );

    await expect(fetchProjects()).rejects.toThrow(
      'Project data could not be loaded (503).',
    );
  });
});
