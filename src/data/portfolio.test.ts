import { describe, expect, it, vi } from 'vitest';
import {
  fetchExperience,
  fetchHomePortfolio,
  fetchProjectDetails,
  fetchSkills,
} from './portfolio';

describe('portfolio content requests', () => {
  it('loads the home content separately from non-home data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ projects: [], skills: [] }), {
            status: 200,
          }),
      ),
    );

    await expect(fetchHomePortfolio()).resolves.toEqual({
      projects: [],
      skills: [],
    });
    expect(fetch).toHaveBeenCalledWith('/data/home.json');
  });

  it('uses dedicated endpoints for deferred route content', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({}), { status: 200 })),
    );

    await Promise.all([
      fetchProjectDetails(),
      fetchExperience(),
      fetchSkills(),
    ]);

    expect(fetch).toHaveBeenNthCalledWith(1, '/data/project-details.json');
    expect(fetch).toHaveBeenNthCalledWith(2, '/data/experience.json');
    expect(fetch).toHaveBeenNthCalledWith(3, '/data/skills.json');
  });

  it('reports unsuccessful responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('', { status: 503 })),
    );

    await expect(fetchHomePortfolio()).rejects.toThrow(
      'Home content could not be loaded (503).',
    );
  });
});
