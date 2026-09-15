import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SiteLayout } from './SiteLayout';

beforeEach(() => {
  vi.stubGlobal('scrollTo', vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

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
    expect(screen.getByRole('link', { name: 'Learning' })).toHaveAttribute(
      'href',
      '/learning',
    );
  });

  it('returns visitors to the top when the route changes', () => {
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);

    render(
      <MemoryRouter>
        <SiteLayout>
          <p>Portfolio content</p>
        </SiteLayout>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Experience' }));

    expect(scrollTo).toHaveBeenLastCalledWith(0, 0);
  });

  it('shows current courses with their compact labels when supplied', () => {
    render(
      <MemoryRouter>
        <SiteLayout
          currentLearning={[
            {
              id: 'node',
              displayName: 'Node.js fundamentals',
              status: 'in-progress',
              startDate: '2026-09',
              platform: { name: 'Example platform' },
            },
            {
              id: 'go',
              displayName: 'Specialisation in Go language',
              shortDisplayName: 'Go',
              status: 'in-progress',
              startDate: '2026-09',
              platform: { name: 'Example platform' },
            },
          ]}
        >
          <p>Portfolio content</p>
        </SiteLayout>
      </MemoryRouter>,
    );

    expect(screen.getByText('Currently learning:')).toBeInTheDocument();
    expect(screen.getByText('Node.js fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
  });
});
