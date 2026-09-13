import { describe, expect, it, vi } from 'vitest';
import { fetchPortfolio } from './portfolio';

describe('fetchPortfolio', () => {
  it('returns the generated portfolio content', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ projects: [], experience: [] }), {
            status: 200,
          }),
      ),
    );

    await expect(fetchPortfolio()).resolves.toEqual({
      projects: [],
      experience: [],
    });
    expect(fetch).toHaveBeenCalledWith('/data/portfolio.json');
  });

  it('reports unsuccessful responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('', { status: 503 })),
    );

    await expect(fetchPortfolio()).rejects.toThrow(
      'Portfolio data could not be loaded (503).',
    );
  });
});
