// @vitest-environment node

import { describe, expect, it } from 'vitest';
import config from './vite.config';

describe('Vite configuration', () => {
  it('enables React and Tailwind integration', () => {
    expect(config.plugins).toHaveLength(3);
  });

  it('adds a Surge SPA fallback to the production build', () => {
    expect(config.plugins?.at(-1)?.name).toBe('surge-spa-fallback');
  });
});
