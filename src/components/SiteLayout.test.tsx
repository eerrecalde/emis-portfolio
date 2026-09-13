import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { SiteLayout } from './SiteLayout';

describe('SiteLayout', () => {
  it('uses the portfolio brand name in the primary navigation', () => {
    render(
      <MemoryRouter>
        <SiteLayout>
          <p>Portfolio content</p>
        </SiteLayout>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('link', { name: 'Emi Errecalde.' }),
    ).toHaveAttribute('href', '/');
  });
});
