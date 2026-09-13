// @vitest-environment node

import { describe, expect, it } from 'vitest';
import config from './vite.config';

describe('Vite configuration', () => {
  it('enables React and Tailwind integration', () => {
    expect(config.plugins).toHaveLength(2);
  });
});
