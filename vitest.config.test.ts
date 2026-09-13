// @vitest-environment node

import { describe, expect, it } from 'vitest';
import config from './vitest.config';

describe('Vitest configuration', () => {
  it('uses the browser-like test environment', () => {
    expect(config.test?.environment).toBe('jsdom');
    expect(config.test?.clearMocks).toBe(true);
  });
});
